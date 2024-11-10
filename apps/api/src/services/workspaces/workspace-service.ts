import { sendMail } from "@/utils/mail";
import { joinWorkspaceTemplate } from "@/utils/templates";
import type { PrismaClient } from "@squared/db";
import type { Logger } from "@squared/logger";
import jwt from "jsonwebtoken";
import type {
	CreateWorkspaceParams,
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

	constructor(db: PrismaClient, logger: Logger, JWT_SECRET: string) {
		this.db = db;
		this.logger = logger;
		this.JWT_SECRET = JWT_SECRET;
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
			this.logger.error("Workspace already exists");
			throw new Error("Workspace already exists");
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
			this.logger.error("Workspace not created");
			throw new Error("Workspace not created");
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
		// Verify the token
		const decoded = jwt.verify(token, this.JWT_SECRET) as {
			workspaceId: string;
		};

		const existingUserWorkspace = await this.db.userWorkspace.findFirst({
			where: {
				userId,
				workspaceId: decoded.workspaceId,
			},
		});

		const workspace = await this.db.workspace.findUnique({
			where: { id: decoded.workspaceId },
			include: {
				Labels: true,
			},
		});

		if (existingUserWorkspace) {
			return await this.db.workspace.findUnique({
				where: { id: decoded.workspaceId },
				include: {
					Labels: true,
				},
			});
		}

		const user = await this.db.user.findUnique({
			where: { id: userId },
		});
		const teams = await this.db.team.findMany({
			where: {
				workspaceId: decoded.workspaceId,
			},
		});

		if (!workspace) throw new Error("Workspace not found.");
		if (teams.length === 0) throw new Error("No teams found.");
		if (!user) throw new Error("User not found.");

		await Promise.all([
			this.db.userWorkspace.create({
				data: {
					user: { connect: { id: userId } },
					workspace: { connect: { id: decoded.workspaceId } },
				},
			}),
			this.db.userTeam.createMany({
				data: teams.map((team) => ({
					userId,
					teamId: team.id,
				})),
			}),
		]);

		// Fetch the updated workspace with user info
		const updatedWorkspace = await this.db.workspace.findUnique({
			where: { id: decoded.workspaceId },
			include: {
				Labels: true,
			},
		});

		if (user.onBoarding || !user.verified) {
			await this.db.user.update({
				where: { id: userId },
				data: { onBoarding: false, verified: true },
			});
		}
		return updatedWorkspace;
	}
	async inviteToWorkspace({
		workspaceId,
		email,
	}: {
		workspaceId: string;
		email: string | string[];
	}): Promise<void> {
		this.logger.info("Inviting user to workspace: %0", { email, workspaceId });

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

		if (!workspace) throw new Error("Workspace not found.");

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
}
