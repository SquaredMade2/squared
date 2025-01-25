import { sendMail } from "@/utils/mail";
import { joinWorkspaceTemplate } from "@/utils/templates";
import {
	type DBClient,
	type Label,
	type SQL,
	type Team,
	type User,
	type Workspace,
	type WorkspaceLabel,
	type WorkspaceRole,
	and,
	eq,
	inArray,
	labelsTable,
	sql,
	teamsTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspacesTable,
} from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import jwt from "jsonwebtoken";
import type {
	CreateWorkspaceParams,
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
	private readonly db: DBClient;
	private readonly logger: Logger;
	private readonly JWT_SECRET: string;

	constructor(db: DBClient, JWT_SECRET?: string) {
		this.db = db;
		if (!JWT_SECRET) this.throwError("JWT_SECRET is not defined.");
		this.JWT_SECRET = JWT_SECRET;
		this.logger = createCustomLogger("workspace");
	}

	async createWorkspace({
		userId,
		workspace,
	}: CreateWorkspaceParams): Promise<WorkspaceLabel> {
		console.info(
			"Creating workspace for user %s and payload %o",
			userId,
			workspace,
		);

		return await this.db.transaction(async (tx) => {
			const existingWorkspace = await tx
				.select()
				.from(workspacesTable)
				.where(eq(workspacesTable.url, workspace.url))
				.limit(1);

			if (existingWorkspace.length > 0) {
				throw new Error("Workspace already exists");
			}

			const [newWorkspace] = await tx
				.insert(workspacesTable)
				.values({
					...workspace,
					admins: [userId],
				})
				.returning();

			if (!newWorkspace) {
				throw new Error("Workspace not created");
			}

			await tx.insert(userWorkspacesTable).values({
				userId: userId,
				workspaceId: newWorkspace.id,
				role: "owner",
			});

			const newLabels = await tx
				.insert(labelsTable)
				.values(
					DEFAULT_LABELS.map((label) => ({
						name: label.name,
						description: label.description,
						color: label.color,
						workspaceId: newWorkspace.id,
					})),
				)
				.returning();

			await tx.insert(teamsTable).values({
				workspaceId: newWorkspace.id,
				name: newWorkspace.name,
				identifier: newWorkspace.url.slice(0, 3).toUpperCase(),
			});

			await tx.insert(userTeamsTable).values({
				userId: userId,
				teamId: newWorkspace.id,
			});

			return {
				...newWorkspace,
				labels: newLabels,
			};
		});
	}
	async getWorkspace({
		workspaceId,
	}: { workspaceId: string }): Promise<WorkspaceLabel | null> {
		console.info("Getting workspace with id %s", workspaceId);
		return await this.getWorkspaceWithLabels(eq(workspacesTable, workspaceId));
	}

	async getWorkspaceByUrl({
		url,
	}: { url: string }): Promise<WorkspaceLabel | null> {
		console.info("Getting workspace with url %s", url);
		return await this.getWorkspaceWithLabels(eq(workspacesTable.url, url));
	}

	async updateWorkspace({
		workspaceId,
		workspace,
	}: {
		workspaceId: string;
		workspace: WorkspaceParams;
	}): Promise<WorkspaceLabel> {
		console.info(
			"Updating workspace with id %s and payload %o",
			workspaceId,
			workspace,
		);

		return await this.db.transaction(async (tx) => {
			const [updatedWorkspace] = await tx
				.update(workspacesTable)
				.set(workspace)
				.where(eq(workspacesTable.id, workspaceId))
				.returning();

			if (!updatedWorkspace) {
				throw new Error("Workspace not found");
			}

			const workspaceLabels = await tx
				.select()
				.from(labelsTable)
				.where(eq(labelsTable.workspaceId, workspaceId));

			return { ...updatedWorkspace, labels: workspaceLabels };
		});
	}

	async deleteWorkspace({
		workspaceId,
	}: { workspaceId: string }): Promise<void> {
		console.info("Deleting workspace with id %s", workspaceId);

		await this.db.transaction(async (tx) => {
			// Delete associated labels first
			await tx
				.delete(labelsTable)
				.where(eq(labelsTable.workspaceId, workspaceId));

			// Then delete the workspace
			await tx
				.delete(workspacesTable)
				.where(eq(workspacesTable.id, workspaceId));
		});
	}
	async getUserWorkspaces({
		userId,
	}: { userId: string }): Promise<WorkspaceLabel[]> {
		this.logger.info("Getting workspaces for user %s", userId);
		const workspaces = await this.db
			.select({
				workspace: workspacesTable,
				labels: sql<Label[] | null>`json_agg(${labelsTable.name})`.as("labels"),
			})
			.from(workspacesTable)
			.leftJoin(labelsTable, eq(labelsTable.workspaceId, workspacesTable.id))
			.innerJoin(
				userWorkspacesTable,
				eq(userWorkspacesTable.workspaceId, workspacesTable.id),
			)
			.where(eq(userWorkspacesTable.userId, userId))
			.groupBy(workspacesTable.id);

		return workspaces.map((result) => ({
			...result.workspace,
			labels: result.labels || [],
		}));
	}
	async joinWorkspace({
		token,
		userId,
	}: { token: string; userId: string }): Promise<WorkspaceLabel | null> {
		this.logger.info(`User ${userId} attempting to join workspace with token`);

		const workspaceId = this.verifyToken(token);
		if (!workspaceId) {
			this.throwError("Invalid token");
		}

		const { userWorkspace, workspace, user, teams } =
			await this.fetchWorkspaceData(workspaceId, userId);

		if (!user) this.throwError("User not found.");
		if (userWorkspace) return workspace;

		this.validateJoinWorkspaceData(workspace, teams, user);

		Promise.all([
			this.createUserWorkspaceConnections(userId, workspaceId, teams),
			this.updateUserOnboarding(user),
		]);

		return workspace;
	}
	async removeUserFromWorkspace({
		workspaceId,
		userId,
	}: {
		workspaceId: string;
		userId: string;
	}): Promise<{ success: boolean }> {
		this.logger.info("Removing user from workspace");

		return await this.db.transaction(async (tx) => {
			// Find workspace teams
			const workspaceTeams = await tx
				.select()
				.from(teamsTable)
				.where(eq(teamsTable.workspaceId, workspaceId));

			// Remove user from teams
			if (workspaceTeams.length > 0) {
				for (const team of workspaceTeams) {
					const userTeam = await tx
						.select()
						.from(userTeamsTable)
						.where(
							and(
								eq(userTeamsTable.userId, userId),
								eq(userTeamsTable.teamId, team.id),
							),
						)
						.limit(1);

					if (userTeam.length > 0) {
						await tx
							.delete(userTeamsTable)
							.where(
								and(
									eq(userTeamsTable.userId, userId),
									eq(userTeamsTable.teamId, team.id),
								),
							);
					}
				}
			}

			// Remove user from workspace
			await tx
				.delete(userWorkspacesTable)
				.where(
					and(
						eq(userWorkspacesTable.userId, userId),
						eq(userWorkspacesTable.workspaceId, workspaceId),
					),
				);

			return { success: true };
		});
	}
	async inviteToWorkspace({
		workspaceId,
		email,
	}: {
		workspaceId: string;
		email: string | string[];
	}): Promise<{ success: boolean }> {
		this.logger.info("Inviting user to workspace: %0", {
			email,
			workspaceId,
		});

		return await this.db.transaction(async (tx) => {
			// Check if the workspace exists
			const workspaceWithUsers = await tx
				.select({
					workspace: workspacesTable,
					user: usersTable,
				})
				.from(workspacesTable)
				.leftJoin(
					userWorkspacesTable,
					eq(userWorkspacesTable.workspaceId, workspacesTable.id),
				)
				.leftJoin(
					usersTable,
					eq(userWorkspacesTable.userId, usersTable.externalId),
				)
				.where(eq(workspacesTable.id, workspaceId));

			if (workspaceWithUsers.length === 0) {
				this.throwError("Workspace not found.");
			}

			const workspace = workspaceWithUsers[0].workspace;
			const workspaceEmails = workspaceWithUsers
				.map((row) => row.user?.email)
				.filter((email): email is string => email !== undefined);

			// Generate token
			const token = jwt.sign({ workspaceId, email }, this.JWT_SECRET, {
				expiresIn: "1h",
			});

			const emailsToSend = Array.isArray(email) ? email : [email];
			const existingUsers = await tx
				.select()
				.from(usersTable)
				.where(inArray(usersTable.email, emailsToSend));

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

			return { success: true };
		});
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
		return await this.db.transaction(async (tx) => {
			const [userWorkspace, workspace, user, teams] = await Promise.all([
				// Query 1: Find user workspace
				tx
					.select()
					.from(userWorkspacesTable)
					.where(
						and(
							eq(userWorkspacesTable.userId, userId),
							eq(userWorkspacesTable.workspaceId, workspaceId),
						),
					)
					.limit(1)
					.then((results) => results[0]),

				// Query 2: Find workspace with labels
				this.getWorkspaceWithLabels(eq(workspacesTable.id, workspaceId)),

				// Query 3: Find user
				tx
					.select()
					.from(usersTable)
					.where(eq(usersTable.externalId, userId))
					.limit(1)
					.then((results) => results[0]),

				// Query 4: Find teams
				tx
					.select()
					.from(teamsTable)
					.where(eq(teamsTable.workspaceId, workspaceId)),
			]);
			return { userWorkspace, workspace, user, teams };
		});
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
		teams: { id: string }[],
		role: WorkspaceRole = "member",
	) {
		await this.db.transaction(async (tx) => {
			await Promise.all([
				// Create user-workspace connection
				tx
					.insert(userWorkspacesTable)
					.values({
						userId,
						workspaceId,
						role,
					}),

				// Create user-team connections
				tx
					.insert(userTeamsTable)
					.values(teams.map((team) => ({ userId, teamId: team.id }))),
			]);
		});
	}

	private async updateUserOnboarding(user: {
		id: string;
		onBoarding: boolean;
	}) {
		if (user.onBoarding) {
			await this.db
				.update(usersTable)
				.set({ onBoarding: false })
				.where(eq(usersTable.externalId, user.id));
		}
	}
	private async getWorkspaceWithLabels(
		where: SQL<unknown>,
	): Promise<WorkspaceLabel | null> {
		const results = await this.db
			.select()
			.from(workspacesTable)
			.leftJoin(labelsTable, eq(workspacesTable.id, labelsTable.workspaceId))
			.where(where);

		const workspaceWithLabels = results.reduce(
			(acc, row) => {
				if (!acc.workspace) {
					acc.workspace = { ...row.Workspace, labels: [] };
				}
				if (row.Label) {
					acc.workspace.labels.push(row.Label);
				}
				return acc;
			},
			{ workspace: null as WorkspaceLabel | null },
		).workspace;

		return workspaceWithLabels;
	}
}
