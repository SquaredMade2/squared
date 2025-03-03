import {
	type DBClient,
	type Team,
	type Workspace,
	and,
	desc,
	eq,
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

	async deleteUser({ userId }: { userId: string }) {
		this.logger.info("Marking user as deleted", userId);
		await this.db
			.update(usersTable)
			.set({ deleted: true })
			.where(eq(usersTable.externalId, userId));
	}

	async onBoardUser({ userId }: { userId: string }) {
		this.logger.info("Onboarding user with id: ", userId);
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
		this.logger.info("Updating user with id: ", userId);
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
		notificationIds,
	}: {
		userId: string;
		notificationIds: string[];
	}) {
		this.logger.info("Updating user notifications with id: ", userId);
		return await this.db.transaction(async (tx) => {
			const currentNotifications = await tx
				.select({ savedNotificationIds: usersTable.savedNotificationIds })
				.from(usersTable)
				.where(eq(usersTable.externalId, userId))
				.then((results) => results[0].savedNotificationIds);

			return tx
				.update(usersTable)
				.set({
					savedNotificationIds: [
						...new Set([...currentNotifications, ...notificationIds]),
					],
				})
				.where(eq(usersTable.externalId, userId))
				.returning()
				.then((user) => user[0]);
		});
	}

	async getUser({ userId }: { userId: string }) {
		this.logger.info("Fetching user with id: ", userId);
		return await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.externalId, userId))
			.then((user) => user[0]);
	}

	async getWorkspaceUsers({ workspaceId }: { workspaceId: string }) {
		this.logger.info("Fetching workspace users with id: ", workspaceId);
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

	async getTeamUsers({ teamId }: { teamId: string }) {
		this.logger.info("Fetching team users with id: ", teamId);
		return await this.db
			.select()
			.from(userTeamsTable)
			.leftJoin(usersTable, eq(usersTable.externalId, userTeamsTable.userId))
			.where(eq(userTeamsTable.teamId, teamId))
			.then((users) => users.map((u) => u.User).filter((u) => !!u));
	}

	async getUserAvatars({ workspaceId }: { workspaceId: string }) {
		this.logger.info("Fetching user avatars with id: ", workspaceId);
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

	async getUserTeams({ userId }: { userId: string }): Promise<Team[]> {
		this.logger.info("Fetching user teams with id: ", userId);
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
			"Setting last viewed task for userId, taskId: ",
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
		this.logger.info("Fetching default workspace for userId: ", userId);
		const userWorkspace = await this.db.transaction(async (tx) => {
			// First, try to get the user's default workspace
			const defaultWorkspace = await tx
				.select({
					workspace: workspacesTable,
				})
				.from(usersTable)
				.leftJoin(
					workspacesTable,
					eq(usersTable.defaultWorkspaceId, workspacesTable.externalId),
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
					eq(userWorkspacesTable.workspaceId, workspacesTable.externalId),
				)
				.where(eq(userWorkspacesTable.userId, userId))
				.orderBy(desc(workspacesTable.createdAt))
				.limit(1)
				.then((results) => results[0]?.workspace);

			return firstWorkspace || null;
		});

		if (!userWorkspace) return null;

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
			"Checking if user with id is authorized for team with identifier",
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

			return userTeam.length > 0;
		});
	}
}
