import { sendMail } from "@/utils/mail";
import { joinWorkspaceTemplate } from "@/utils/templates";
import type { PrismaClient, Team, User, Workspace } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import jwt from "jsonwebtoken";
import type {
	CreateWorkspaceParams,
	LabelParams,
	WorkspaceLabels,
	WorkspaceParams,
	WorkspaceRpc,
} from "./types";

const DEFAULT_LABELS = [
	{ name: "Feature", description: "New feature", color: "#FF5733" },
	{ name: "Bug", description: "Bug fix", color: "#C70039" },
	{ name: "Chore", description: "General task", color: "#900C3F" },
	{ name: "Refactor", description: "Code refactor", color: "#581845" },
	{ name: "Docs", description: "Documentation", color: "#FFC300" },
	{ name: "Test", description: "Testing task", color: "#DAF7A6" },
	{
		name: "Design",
		description: "Design related task",
		color: "#33FFBD",
	},
];

export class WorkspaceService implements WorkspaceRpc {
	private readonly db: PrismaClient;
	private readonly logger: Logger;
	private readonly JWT_SECRET: string;

	constructor(db: PrismaClient, JWT_SECRET?: string) {
		this.db = db;
		if (!JWT_SECRET) this.throwError("JWT_SECRET is not defined.");
		this.JWT_SECRET = JWT_SECRET;
		this.logger = createCustomLogger("workspace");
	}

	async createWorkspace({
		userId,
		workspace,
	}: CreateWorkspaceParams): Promise<WorkspaceLabels> {
		this.logger.info(
			"Creating workspace for user %s and payload %o",
			userId,
			workspace,
		);
		const existingWorkspace = await this.db.workspace.findFirst({
			where: {
				url: workspace.url,
			},
		});

		if (existingWorkspace) {
			this.throwError("Workspace already exists");
		}

		const newWorkspace = await this.db.workspace.create({
			data: {
				...workspace,
				admins: [userId],
				Users: {
					create: {
						userId: userId,
					},
				},
				Labels: {
					create: DEFAULT_LABELS.map((label) => ({
						name: label.name,
						description: label.description,
						color: label.color,
					})),
				},
			},
			include: {
				Labels: true,
			},
		});

		if (!newWorkspace) {
			this.throwError("Workspace not created");
		}

		await this.db.team.create({
			data: {
				workspaceId: newWorkspace.id,
				name: newWorkspace.name,
				identifier: newWorkspace.url.slice(0, 3).toUpperCase(),
				Users: {
					create: {
						userId,
					},
				},
			},
		});

		// Return the new workspace
		return newWorkspace;
	}
	async getWorkspace({
		workspaceId,
	}: { workspaceId: string }): Promise<WorkspaceLabels | null> {
		this.logger.info("Getting workspace with id %s", workspaceId);
		return await this.db.workspace.findUnique({
			where: {
				id: workspaceId,
			},
			include: {
				Labels: true,
			},
		});
	}
	async getWorkspaceByUrl({
		url,
	}: { url: string }): Promise<WorkspaceLabels | null> {
		this.logger.info("Getting workspace with url %s", url);
		return await this.db.workspace.findUnique({
			where: {
				url,
			},
			include: {
				Labels: true,
			},
		});
	}
	async updateWorkspace({
		workspaceId,
		workspace,
	}: {
		workspaceId: string;
		workspace: WorkspaceParams;
	}): Promise<WorkspaceLabels> {
		this.logger.info(
			"Updating workspace with id %s and payload %o",
			workspaceId,
			workspace,
		);
		return await this.db.workspace.update({
			where: {
				id: workspaceId,
			},
			data: workspace,
			include: {
				Labels: true,
			},
		});
	}
	async deleteWorkspace({
		workspaceId,
	}: { workspaceId: string }): Promise<void> {
		this.logger.info("Deleting workspace with id %s", workspaceId);
		await this.db.workspace.delete({
			where: {
				id: workspaceId,
			},
		});
	}
	async getUserWorkspaces({
		userId,
	}: { userId: string }): Promise<WorkspaceLabels[]> {
		this.logger.info("Getting workspaces for user %s", userId);
		return await this.db.workspace.findMany({
			where: {
				Users: {
					some: {
						userId,
					},
				},
			},
			include: {
				Labels: true,
			},
		});
	}
	async joinWorkspace({
		token,
		userId,
	}: { token: string; userId: string }): Promise<WorkspaceLabels | null> {
		this.logger.info(`User ${userId} attempting to join workspace with token`);

		const workspaceId = this.verifyToken(token);
		if (!workspaceId) {
			this.throwError("Invalid token");
		}

		const [existingUserWorkspace, workspace, user, teams] =
			await this.fetchWorkspaceData(workspaceId, userId);

		if (!user) this.throwError("User not found.");
		if (existingUserWorkspace) return workspace;

		await this.validateJoinWorkspaceData(workspace, teams, user);

		await this.createUserWorkspaceConnections(userId, workspaceId, teams);

		await this.updateUserOnboarding(user);

		return workspace;
	}
	async removeUserFromWorkspace({
		workspaceId,
		userId,
	}: { workspaceId: string; userId: string }): Promise<void> {
		this.logger.info("Removing user from workspace");

		const workspaceTeams = await this.db.team.findMany({
			where: { workspaceId },
		});

		if (workspaceTeams.length > 0) {
			await Promise.all(
				workspaceTeams.map(async (team) => {
					const userTeam = await this.db.userTeam.findUnique({
						where: { userId_teamId: { userId, teamId: team.id } },
					});
					if (userTeam) {
						await this.db.userTeam.delete({
							where: { userId_teamId: { userId, teamId: team.id } },
						});
					}
				}),
			);
		}

		await this.db.userWorkspace.delete({
			where: { userId_workspaceId: { userId, workspaceId } },
		});
	}
	async inviteToWorkspace({
		workspaceId,
		email,
	}: {
		workspaceId: string;
		email: string | string[];
	}): Promise<void> {
		this.logger.info("Inviting user to workspace: %0", {
			email,
			workspaceId,
		});

		// Check if the workspace exists
		const workspace = await this.db.workspace.findUnique({
			where: { id: workspaceId },
			include: {
				Users: {
					include: {
						user: true,
					},
				},
			},
		});

		const workspaceEmails = workspace?.Users.map((u) => u.user.email) ?? [];

		if (!workspace) this.throwError("Workspace not found.");

		// Generate token
		const token = jwt.sign({ workspaceId, email }, this.JWT_SECRET, {
			expiresIn: "1h",
		});

		const emailsToSend = Array.isArray(email) ? email : [email];
		const existingUsers = await this.db.user.findMany({
			where: {
				email: {
					in: emailsToSend,
				},
			},
		});

		// Send email with the token
		for (const email of emailsToSend.filter(
			(email) => !workspaceEmails.includes(email),
		)) {
			const newUser = !existingUsers.some((u) => u.email === email);
			await sendMail({
				logger: this.logger,
				email,
				subject: "Workspace Invitation",
				html: joinWorkspaceTemplate({
					username: existingUsers.find((u) => u.email === email)?.name,
					path: newUser ? `register?token=${token}` : `login?token=${token}`,
					workspaceName: workspace.name,
				}),
			});
		}
	}
	async updateWorkspaceLabel({
		workspaceId,
		labelId,
		data,
	}: { workspaceId: string; labelId: string; data: LabelParams }) {
		this.logger.info("Updating workspace label");
		const workspace = await this.db.workspace.findUnique({
			where: { id: workspaceId },
			include: { Labels: true },
		});
		if (!workspace) this.throwError("Workspace not found.");
		const labelExists = workspace.Labels.some((label) => label.id === labelId);
		if (!labelExists) this.throwError("Label not found in workspace.");
		return await this.db.label.update({ where: { id: labelId }, data });
	}
	async deleteWorkspaceLabel({
		workspaceId,
		labelId,
	}: { workspaceId: string; labelId: string }) {
		this.logger.info("Deleting workspace label");
		const workspace = await this.db.workspace.findUnique({
			where: { id: workspaceId },
			include: { Labels: true },
		});
		if (!workspace) this.throwError("Workspace not found.");

		const labelExists = workspace.Labels.some((label) => label.id === labelId);
		if (!labelExists) this.throwError("Label not found.");
		await this.deleteLabelFromTasks(labelId, workspaceId);
		await this.db.label.delete({ where: { id: labelId } });

		const updatedWorkspace = await this.db.workspace.findUnique({
			where: { id: workspaceId },
			include: { Labels: true },
		});
		if (!updatedWorkspace) this.throwError("Workspace not found.");
		return updatedWorkspace;
	}
	private verifyToken(token: string): string | null {
		try {
			const decoded = jwt.verify(token, this.JWT_SECRET) as {
				workspaceId: string;
			};
			return decoded.workspaceId;
		} catch (error) {
			this.logger.error("Token verification failed", error);
			return null;
		}
	}
	private throwError(message: string): never {
		this.logger.error(message);
		throw new Error(message);
	}
	private async fetchWorkspaceData(workspaceId: string, userId: string) {
		return await Promise.all([
			this.db.userWorkspace.findFirst({ where: { userId, workspaceId } }),
			this.db.workspace.findUnique({
				where: { id: workspaceId },
				include: { Labels: true },
			}),
			this.db.user.findUnique({ where: { id: userId } }),
			this.db.team.findMany({ where: { workspaceId } }),
		]);
	}
	private validateJoinWorkspaceData(
		workspace: Workspace | null,
		teams: Team[],
		user: User | null,
	) {
		if (!workspace) this.throwError("Workspace not found.");
		if (teams.length === 0)
			this.throwError("No teams found in this workspace.");
		if (!user) this.throwError("User not found.");
	}
	private async createUserWorkspaceConnections(
		userId: string,
		workspaceId: string,
		teams: Team[],
	) {
		await Promise.all([
			this.db.userWorkspace.create({
				data: {
					user: { connect: { id: userId } },
					workspace: { connect: { id: workspaceId } },
				},
			}),
			this.db.userTeam.createMany({
				data: teams.map((team) => ({ userId, teamId: team.id })),
			}),
		]);
	}
	private async updateUserOnboarding(user: User) {
		if (user.onBoarding || !user.verified) {
			await this.db.user.update({
				where: { id: user.id },
				data: { onBoarding: false, verified: true },
			});
		}
	}
	private async deleteLabelFromTasks(labelId: string, workspaceId: string) {
		const tasks = await this.db.task.findMany({
			where: { workspaceId, labels: { has: labelId } },
		});

		for (const task of tasks) {
			const updatedLabels = task.labels.filter((id) => id !== labelId);
			await this.db.task.update({
				where: { id: task.id },
				data: { labels: { set: updatedLabels } },
			});
		}
	}
}
