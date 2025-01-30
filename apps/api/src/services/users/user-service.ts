import {
	type DBClient,
	type Team,
	type Workspace,
	type WorkspaceRole,
	and,
	desc,
	eq,
	githubRepoInfoTable,
	inArray,
	teamsTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspacesTable,
} from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type { UserRpc } from "./types";

export class UserService implements UserRpc {
	private readonly db: DBClient;
	private readonly logger: Logger;
	constructor(db: DBClient) {
		this.db = db;
		this.logger = createCustomLogger("users");
	}

	async onBoardUser({ userId }: { userId: string }) {
		this.logger.info("Onboarding user with id: %s", userId);
		return await this.db
			.update(usersTable)
			.set({ onBoarding: false })
			.where(eq(usersTable.externalId, userId))
			.returning()
			.then((user) => user[0]);
	}

	async updateUser({
		userId,
		...args
	}: { userId: string; name: string; username?: string }) {
		this.logger.info("Updating user with id: %s", userId);
		return await this.db
			.update(usersTable)
			.set(args)
			.where(eq(usersTable.externalId, userId))
			.returning()
			.then((user) => user[0]);
	}

	async updateUserAvatar({
		userId,
		avatarUrl,
	}: { userId: string; avatarUrl: string }) {
		this.logger.info(
			"Updating user avatar with\n\tuserId:  %s\n\turl:     %s",
			userId,
			avatarUrl,
		);
		return await this.db
			.update(usersTable)
			.set({ avatarUrl })
			.where(eq(usersTable.externalId, userId))
			.returning()
			.then((user) => user[0]);
	}

	async updateUserNotifications({
		userId,
		notificationIds: savedNotificationIds,
	}: {
		userId: string;
		notificationIds: string[];
	}) {
		this.logger.info("Updating user notifications with id: %s", userId);
		return await this.db
			.update(usersTable)
			.set({ savedNotificationIds })
			.where(eq(usersTable.externalId, userId))
			.returning()
			.then((user) => user[0]);
	}

	async getUser({ userId }: { userId: string }) {
		this.logger.info("Fetching user with id: %s", userId);
		return await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.externalId, userId))
			.then((user) => user[0]);
	}

	async getUserWorkspaceRole({
		userId,
		workspaceId,
	}: {
		userId: string;
		workspaceId: string;
	}): Promise<{ role: WorkspaceRole }> {
		this.logger.info(
			"Fetching user role for userId: %s in workspaceId: %s",
			userId,
			workspaceId,
		);

		const userWorkspace = await this.db
			.select({ role: userWorkspacesTable.role })
			.from(userWorkspacesTable)
			.where(
				and(
					eq(userWorkspacesTable.userId, userId),
					eq(userWorkspacesTable.workspaceId, workspaceId),
				),
			)
			.limit(1)
			.then((results) => results[0]);

		if (!userWorkspace) throw new Error("User-Workspace connection not found");
		return { role: userWorkspace.role };
	}

	async getWorkspaceUsers({ workspaceId }: { workspaceId: string }) {
		this.logger.info("Fetching workspace users with id: %s", workspaceId);
		return await this.db
			.select()
			.from(userWorkspacesTable)
			.leftJoin(
				usersTable,
				eq(usersTable.externalId, userWorkspacesTable.userId),
			)
			.where(eq(userWorkspacesTable.workspaceId, workspaceId))
			.then((users) => users.map((u) => u.User).filter((u) => !!u));
	}

	async getWorkspaceUsersWithRoles({ workspaceId }: { workspaceId: string }) {
		this.logger.info("Fetching workspace users with id: %s", workspaceId);
		const thingo = await this.db
			.select()
			.from(usersTable)
			.leftJoin(
				userWorkspacesTable,
				eq(usersTable.externalId, userWorkspacesTable.userId),
			)
			.where(eq(userWorkspacesTable.workspaceId, workspaceId))
			.limit(1)
			.then((uw) => {
				return uw.map((uuw) => {
					return { ...uuw.User, role: uuw.UserWorkspace?.role ?? "member" };
				});
			});
		return thingo;
	}

	async updateUsersRole({
		callerId,
		userId,
		workspaceId,
		newRole,
	}: {
		callerId: string;
		userId: string;
		workspaceId: string;
		newRole: WorkspaceRole;
	}) {
		// Get both users current roles
		const [callerRole, targetRole] = await this.db
			.select()
			.from(userWorkspacesTable)
			.where(
				and(
					eq(userWorkspacesTable.workspaceId, workspaceId),
					inArray(userWorkspacesTable.userId, [callerId, userId]),
				),
			);

		if (!callerRole || !targetRole) {
			throw new Error("One of the users was not found in workspace");
		}

		if (callerRole.role === "member") {
			throw new Error("Members cannot modify roles");
		}

		if (
			callerRole.role === "admin" &&
			(targetRole.role === "owner" || targetRole.role === "admin")
		) {
			throw new Error("Admins cannot modify owner or other admin roles");
		}

		this.logger.info(
			"User with id: %s is updating role for userId: %s to %s in workspace: %s",
			callerId,
			userId,
			newRole,
			workspaceId,
		);

		// Start a transaction to ensure both updates happen or neither happens
		return await this.db.transaction(async (tx) => {
			// Making sure there can only ever be one owner
			if (newRole === "owner") {
				await tx
					.update(userWorkspacesTable)
					.set({ role: "admin" })
					.where(
						and(
							eq(userWorkspacesTable.workspaceId, workspaceId),
							eq(userWorkspacesTable.role, "owner"),
						),
					);
			}

			const [result] = await tx
				.update(userWorkspacesTable)
				.set({ role: newRole })
				.where(
					and(
						eq(userWorkspacesTable.userId, userId),
						eq(userWorkspacesTable.workspaceId, workspaceId),
					),
				)
				.returning();

			return result;
		});
	}

	async getTeamUsers({ teamId }: { teamId: string }) {
		this.logger.info("Fetching team users with id: %s", teamId);
		return await this.db
			.select()
			.from(userTeamsTable)
			.leftJoin(usersTable, eq(usersTable.externalId, userTeamsTable.userId))
			.where(eq(userTeamsTable.teamId, teamId))
			.then((users) => users.map((u) => u.User).filter((u) => !!u));
	}

	async getUserAvatars({ workspaceId }: { workspaceId: string }) {
		this.logger.info("Fetching user avatars with id: %s", workspaceId);
		return await this.db
			.select({
				id: usersTable.externalId,
				name: usersTable.name,
				avatarUrl: usersTable.avatarUrl,
			})
			.from(usersTable)
			.leftJoin(
				userWorkspacesTable,
				eq(usersTable.externalId, userWorkspacesTable.userId),
			)
			.where(eq(userWorkspacesTable.workspaceId, workspaceId));
	}

	async getUserRepositories({ userId }: { userId: string }) {
		this.logger.info("Fetching user repositories with id: %s", userId);
		return await this.db.transaction(async (tx) => {
			const user = await tx
				.select({ githubUsername: usersTable.githubUsername })
				.from(usersTable)
				.where(eq(usersTable.externalId, userId))
				.limit(1)
				.then((results) => results[0]);

			if (!user?.githubUsername) {
				throw new Error("GitHub username not found");
			}

			const connectedRepos = await tx
				.select({ repoName: githubRepoInfoTable.repoName })
				.from(githubRepoInfoTable)
				.where(eq(githubRepoInfoTable.owner, user.githubUsername));

			return connectedRepos.map((repo) => repo.repoName);
		});
	}

	async getUserTeams({ userId }: { userId: string }): Promise<Team[]> {
		this.logger.info("Fetching user teams with id: %s", userId);
		return await this.db
			.select()
			.from(teamsTable)
			.leftJoin(userTeamsTable, eq(teamsTable.id, userTeamsTable.teamId))
			.where(eq(userTeamsTable.userId, userId))
			.then((teams) => teams.map((t) => t.Team));
	}

	async setLastViewedTask({
		userId,
		taskId,
	}: {
		userId: string;
		taskId: string;
	}) {
		this.logger.info(
			"Setting last viewed task for userId: %s, taskId: %s",
			userId,
			taskId,
		);
		return await this.db
			.update(usersTable)
			.set({ lastViewedTaskId: taskId })
			.where(eq(usersTable.externalId, userId))
			.returning()
			.then((user) => user[0]);
	}

	async getDefaultWorkspace({
		userId,
	}: { userId: string }): Promise<Workspace | null> {
		this.logger.info("Fetching default workspace for userId: %s", userId);
		const userWorkspace = await this.db.transaction(async (tx) => {
			// First, try to get the user's default workspace
			const defaultWorkspace = await tx
				.select({
					workspace: workspacesTable,
				})
				.from(usersTable)
				.leftJoin(
					workspacesTable,
					eq(usersTable.defaultWorkspaceId, workspacesTable.id),
				)
				.where(eq(usersTable.externalId, userId))
				.then((results) => results[0]?.workspace);

			if (defaultWorkspace) {
				return defaultWorkspace;
			}

			// If no default workspace, get the first workspace the user is associated with
			const firstWorkspace = await tx
				.select({
					workspace: workspacesTable,
				})
				.from(userWorkspacesTable)
				.innerJoin(
					workspacesTable,
					eq(userWorkspacesTable.workspaceId, workspacesTable.id),
				)
				.where(eq(userWorkspacesTable.userId, userId))
				.orderBy(desc(workspacesTable.createdAt))
				.limit(1)
				.then((results) => results[0]?.workspace);

			return firstWorkspace || null;
		});

		if (!userWorkspace) {
			throw new Error("No workspace found for the user");
		}

		return userWorkspace;
	}

	async isUserAuthorized({
		userId,
		teamIdentifier,
	}: {
		userId: string;
		teamIdentifier: string;
	}): Promise<boolean> {
		this.logger.info(
			"Checking if user with id: %s is authorized for team with identifier: %s",
			userId,
			teamIdentifier,
		);

		return await this.db.transaction(async (tx) => {
			const userTeam = await tx
				.select()
				.from(userTeamsTable)
				.innerJoin(teamsTable, eq(userTeamsTable.teamId, teamsTable.id))
				.where(
					and(
						eq(userTeamsTable.userId, userId),
						eq(teamsTable.identifier, teamIdentifier),
					),
				)
				.limit(1);

			if (userTeam.length === 0) {
				throw new Error("User is not authorized for this team");
			}
			return true;
		});
	}
}
