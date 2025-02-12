import { sendMail } from "@/utils/mail";
import { joinWorkspaceTemplate } from "@/utils/templates";
import { type ClerkClient, createClerkClient } from "@clerk/backend";
import {
	type DBClient,
	type Team,
	type User,
	type Workspace,
	type WorkspaceRole,
	and,
	eq,
	inArray,
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
	private readonly clerkClient: ClerkClient;

	constructor(db: DBClient, JWT_SECRET?: string, CLERK_SECRET?: string) {
		this.db = db;
		this.logger = createCustomLogger("workspace");
		if (!JWT_SECRET) this.throwError("JWT_SECRET is not defined.");
		if (!CLERK_SECRET) this.throwError("CLERK_SECRET is not defined.");
		this.JWT_SECRET = JWT_SECRET;
		this.clerkClient = createClerkClient({ secretKey: CLERK_SECRET });
	}

	async createWorkspace({
		userId,
		workspace,
	}: CreateWorkspaceParams): Promise<Workspace> {
		this.logger.info(
			"Creating workspace for user %s and payload %o",
			userId,
			workspace,
		);

		return await this.db.transaction(async (tx) => {
			const [existingWorkspace, [user]] = await Promise.all([
				tx
					.select()
					.from(workspacesTable)
					.where(eq(workspacesTable.url, workspace.url))
					.limit(1),
				tx
					.select({ name: usersTable.name })
					.from(usersTable)
					.where(eq(usersTable.externalId, userId))
					.limit(1),
			]);

			if (existingWorkspace.length > 0) {
				throw new Error("Workspace already exists");
			}
			const organization =
				await this.clerkClient.organizations.createOrganization({
					name: workspace.name,
					slug: workspace.url,
					createdBy: user.name,
				});

			const [newWorkspace] = await tx
				.insert(workspacesTable)
				.values({
					...workspace,
					externalId: organization.id,
					labels: DEFAULT_LABELS,
					admins: [userId],
				})
				.returning();

			if (!newWorkspace) {
				throw new Error("Workspace not created");
			}

			const [_, [newTeam]] = await Promise.all([
				tx.insert(userWorkspacesTable).values({
					userId: userId,
					workspaceId: newWorkspace.externalId,
					role: "owner",
				}),

				tx
					.insert(teamsTable)
					.values({
						workspaceId: newWorkspace.externalId,
						name: newWorkspace.name,
						identifier: newWorkspace.url.slice(0, 3).toUpperCase(),
					})
					.returning(),
			]);
			await tx.insert(userTeamsTable).values({
				userId: userId,
				teamId: newTeam.id,
			});

			return newWorkspace;
		});
	}
	async getWorkspace({
		workspaceId,
	}: { workspaceId: string }): Promise<Workspace | null> {
		this.logger.info("Getting workspace with id %s", workspaceId);
		return await this.db
			.select()
			.from(workspacesTable)
			.where(eq(workspacesTable.externalId, workspaceId))
			.then((results) => results[0]);
	}

	async getWorkspaceByUrl({ url }: { url: string }): Promise<Workspace | null> {
		this.logger.info("Getting workspace with url %s", url);
		return await this.db
			.select()
			.from(workspacesTable)
			.where(eq(workspacesTable.url, url))
			.then((results) => results[0]);
	}

	async updateWorkspace({
		workspaceId,
		workspace,
	}: {
		workspaceId: string;
		workspace: WorkspaceParams;
	}): Promise<Workspace> {
		this.logger.info(
			"Updating workspace with id %s and payload %o",
			workspaceId,
			workspace,
		);

		return await this.db
			.update(workspacesTable)
			.set(workspace)
			.where(eq(workspacesTable.externalId, workspaceId))
			.returning()
			.then((results) => results[0]);
	}

	async deleteWorkspace({
		workspaceId,
	}: { workspaceId: string }): Promise<void> {
		this.logger.info("Deleting workspace with id %s", workspaceId);

		await this.db
			.delete(workspacesTable)
			.where(eq(workspacesTable.externalId, workspaceId));
	}

	async getUserWorkspaces({
		userId,
	}: { userId: string }): Promise<Workspace[]> {
		this.logger.info("Getting workspaces for user: ", userId);
		const workspaces = await this.db
			.select()
			.from(workspacesTable)
			.innerJoin(
				userWorkspacesTable,
				eq(userWorkspacesTable.workspaceId, workspacesTable.externalId),
			)
			.where(eq(userWorkspacesTable.userId, userId));

		return workspaces.map((workspace) => workspace.Workspace);
	}
	async joinWorkspace({
		token,
		userId,
	}: { token: string; userId: string }): Promise<Workspace | null> {
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
		this.logger.info("Inviting user to workspace", {
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
					eq(userWorkspacesTable.workspaceId, workspacesTable.externalId),
				)
				.leftJoin(
					usersTable,
					eq(userWorkspacesTable.userId, usersTable.externalId),
				)
				.where(eq(workspacesTable.externalId, workspaceId));

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
	async getTakenWorkspaceUrls(): Promise<string[]> {
		this.logger.info("Getting taken workspace urls");

		return await this.db
			.select({ url: workspacesTable.url })
			.from(workspacesTable)
			.then((results) => results.map((result) => result.url));
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

				// Query 2: Find workspace
				tx
					.select()
					.from(workspacesTable)
					.where(eq(workspacesTable.externalId, workspaceId))
					.then((results) => results[0]),

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
}
