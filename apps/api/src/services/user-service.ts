import { baseProcedure } from "@/middleware";
import { j } from "@/middleware";
import {
	and,
	desc,
	eq,
	teamsTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspacesTable,
} from "@squaredmade/db";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";

export const userService = j.router({
	onBoardUser: baseProcedure
		.input(z.object({ userId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { userId } = input;
			const { db, logger } = ctx;
			logger.info("Onboarding user with id: ", userId);

			const user = await db
				.update(usersTable)
				.set({ onBoarding: false })
				.where(eq(usersTable.externalId, userId))
				.returning()
				.then((user) => user[0]);

			if (!user) {
				throw new HTTPException(404, { message: "User not found" });
			}

			return c.superjson(user);
		}),

	updateUser: baseProcedure
		.input(
			z.object({
				userId: z.string(),
				name: z.string(),
				username: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { userId, ...args } = input;
			const { db, logger } = ctx;
			logger.info("Updating user with id: ", userId);

			const user = await db
				.update(usersTable)
				.set(args)
				.where(eq(usersTable.externalId, userId))
				.returning()
				.then((user) => user[0]);

			if (!user) {
				throw new HTTPException(404, { message: "User not found" });
			}

			return c.superjson(user);
		}),

	updateUserAvatar: baseProcedure
		.input(
			z.object({
				userId: z.string(),
				avatarUrl: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { userId, avatarUrl } = input;
			const { db, logger } = ctx;
			logger.info(
				"Updating user avatar with\n\tuserId:  %s\n\turl:     %s",
				userId,
				avatarUrl,
			);

			const user = await db
				.update(usersTable)
				.set({ avatarUrl })
				.where(eq(usersTable.externalId, userId))
				.returning()
				.then((user) => user[0]);

			if (!user) {
				throw new HTTPException(404, { message: "User not found" });
			}

			return c.superjson(user);
		}),

	updateUserNotifications: baseProcedure
		.input(
			z.object({
				userId: z.string(),
				notificationIds: z.array(z.string()),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { userId, notificationIds } = input;
			const { db, logger } = ctx;
			logger.info("Updating user notifications with id: ", userId);

			const user = await db.transaction(async (tx) => {
				const userResult = await tx
					.select({ savedNotificationIds: usersTable.savedNotificationIds })
					.from(usersTable)
					.where(eq(usersTable.externalId, userId))
					.then((results) => results[0]);

				if (!userResult) {
					throw new HTTPException(404, { message: "User not found" });
				}

				const currentNotifications = userResult.savedNotificationIds;

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

			return c.superjson(user);
		}),

	getUser: baseProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { userId } = input;
			const { db, logger } = ctx;
			logger.info("Fetching user with id: ", userId);

			const user = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.externalId, userId))
				.then((user) => user[0]);

			if (!user) {
				throw new HTTPException(404, { message: "User not found" });
			}

			return c.superjson(user);
		}),

	getWorkspaceUsers: baseProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { workspaceId } = input;
			const { db, logger } = ctx;
			logger.info("Fetching workspace users with id: ", workspaceId);

			const users = await db
				.select()
				.from(userWorkspacesTable)
				.leftJoin(
					usersTable,
					eq(usersTable.externalId, userWorkspacesTable.userId),
				)
				.where(eq(userWorkspacesTable.workspaceId, workspaceId))
				.then((users) => users.map((u) => u.User).filter((u) => !!u));

			return c.superjson(users);
		}),

	getTeamUsers: baseProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { teamId } = input;
			const { db, logger } = ctx;
			logger.info("Fetching team users with id: ", teamId);

			const users = await db
				.select()
				.from(userTeamsTable)
				.leftJoin(usersTable, eq(usersTable.externalId, userTeamsTable.userId))
				.where(eq(userTeamsTable.teamId, teamId))
				.then((users) => users.map((u) => u.User).filter((u) => !!u));

			return c.superjson(users);
		}),

	getUserAvatars: baseProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { workspaceId } = input;
			const { db, logger } = ctx;
			logger.info("Fetching user avatars with id: ", workspaceId);

			const avatars = await db
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

			return c.superjson(avatars);
		}),

	getUserTeams: baseProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { userId } = input;
			const { db, logger } = ctx;
			logger.info("Fetching user teams with id: ", userId);

			const teams = await db
				.select()
				.from(teamsTable)
				.leftJoin(userTeamsTable, eq(teamsTable.id, userTeamsTable.teamId))
				.where(eq(userTeamsTable.userId, userId))
				.then((teams) => teams.map((t) => t.Team));

			return c.superjson(teams);
		}),

	setLastViewedTask: baseProcedure
		.input(
			z.object({
				userId: z.string(),
				taskId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { userId, taskId } = input;
			const { db, logger } = ctx;
			logger.info(
				"Setting last viewed task for userId, taskId: ",
				userId,
				taskId,
			);

			const user = await db
				.update(usersTable)
				.set({ lastViewedTaskId: taskId })
				.where(eq(usersTable.externalId, userId))
				.returning()
				.then((user) => user[0]);

			if (!user) {
				throw new HTTPException(404, { message: "User not found" });
			}

			return c.superjson(user);
		}),

	getDefaultWorkspace: baseProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { userId } = input;
			const { db, logger } = ctx;
			logger.info("Fetching default workspace for userId: ", userId);

			const userWorkspace = await db.transaction(async (tx) => {
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

			return c.superjson(userWorkspace);
		}),

	isUserAuthorized: baseProcedure
		.input(
			z.object({
				userId: z.string(),
				teamIdentifier: z.string(),
			}),
		)
		.query(async ({ input, ctx, c }) => {
			const { userId, teamIdentifier } = input;
			const { db, logger } = ctx;
			logger.info(
				"Checking if user with id is authorized for team with identifier",
				userId,
				teamIdentifier,
			);

			const isAuthorized = await db.transaction(async (tx) => {
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

			return c.superjson(isAuthorized);
		}),
});
