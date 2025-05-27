import { j } from "@/api/app";
import { baseProcedure } from "@/middleware";
import { and, eq, teamsTable, userTeamsTable } from "@squaredmade/db";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";

export const teamService = j.router({
	createTeam: baseProcedure
		.input(
			z.object({
				name: z.string(),
				identifier: z.string(),
				workspaceId: z.string(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { name, identifier, workspaceId, userId } = input;
			const { db, logger } = ctx;
			logger.info("Creating team", { name, identifier, workspaceId });

			const createdTeam = await db.transaction(async (tx) => {
				// Check if team already exists
				const existingTeam = await tx
					.select()
					.from(teamsTable)
					.where(eq(teamsTable.identifier, identifier))
					.limit(1);

				if (existingTeam.length > 0) {
					throw new HTTPException(400, { message: "Team already exists" });
				}

				// Create the team
				const [createdTeam] = await tx
					.insert(teamsTable)
					.values({
						name,
						identifier,
						workspaceId,
					})
					.returning();

				if (!createdTeam) {
					throw new HTTPException(500, { message: "Failed to create team" });
				}

				// Create user-team association
				await tx.insert(userTeamsTable).values({
					userId,
					teamId: createdTeam.id,
				});

				return createdTeam;
			});

			return c.superjson(createdTeam);
		}),

	updateTeam: baseProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				identifier: z.string().optional(),
				description: z.string().optional(),
				sprintDuration: z.number().optional(),
				sprintsEnabled: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { id, ...args } = input;
			const { db, logger } = ctx;
			logger.info("Updating team", id);

			const updatedTeam = await db.transaction(async (tx) => {
				const [updatedTeam] = await tx
					.update(teamsTable)
					.set(args)
					.where(eq(teamsTable.id, id))
					.returning();

				if (!updatedTeam) {
					throw new HTTPException(404, { message: "Team not found" });
				}

				return updatedTeam;
			});

			return c.superjson(updatedTeam);
		}),

	updateTeamSprints: baseProcedure
		.input(
			z.object({
				id: z.string(),
				sprintDuration: z.number().optional(),
				sprintsEnabled: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { id, ...args } = input;
			const { db, logger } = ctx;
			logger.info("Updating team sprints", id);

			const updatedTeam = await db.transaction(async (tx) => {
				const [updatedTeam] = await tx
					.update(teamsTable)
					.set(args)
					.where(eq(teamsTable.id, id))
					.returning();

				if (!updatedTeam) {
					throw new HTTPException(404, { message: "Team not found" });
				}

				return updatedTeam;
			});

			return c.superjson(updatedTeam);
		}),

	deleteTeam: baseProcedure
		.input(z.object({ teamId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { teamId } = input;
			const { db, logger } = ctx;
			logger.info("Deleting team", teamId);

			const deletedTeam = await db.transaction(async (tx) => {
				const [result] = await tx
					.delete(teamsTable)
					.where(eq(teamsTable.id, teamId))
					.returning();

				if (!result) {
					throw new HTTPException(404, { message: "Team not found" });
				}

				return result;
			});

			return c.superjson(deletedTeam);
		}),

	getTeam: baseProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { teamId } = input;
			const { db, logger } = ctx;
			logger.info("Finding team", teamId);

			const team = await db.transaction(async (tx) => {
				const team = await tx
					.select()
					.from(teamsTable)
					.where(eq(teamsTable.id, teamId))
					.limit(1)
					.then((results) => results[0] || null);

				return team;
			});

			return c.superjson(team);
		}),

	getTeamByIdentifier: baseProcedure
		.input(
			z.object({
				identifier: z.string(),
				workspaceId: z.string(),
			}),
		)
		.query(async ({ input, ctx, c }) => {
			const { identifier, workspaceId } = input;
			const { db, logger } = ctx;
			logger.info("Finding team: ", identifier);

			const team = await db.transaction(async (tx) => {
				const team = await tx
					.select()
					.from(teamsTable)
					.where(
						and(
							eq(teamsTable.identifier, identifier),
							eq(teamsTable.workspaceId, workspaceId),
						),
					)
					.limit(1)
					.then((results) => results[0] || null);

				return team;
			});

			return c.superjson(team);
		}),

	getUserTeams: baseProcedure
		.input(
			z.object({
				userId: z.string(),
				workspaceId: z.string(),
			}),
		)
		.query(async ({ input, ctx, c }) => {
			const { userId, workspaceId } = input;
			const { db, logger } = ctx;
			logger.info("Finding teams for user: ", userId);

			const teams = await db
				.select()
				.from(teamsTable)
				.leftJoin(userTeamsTable, eq(teamsTable.id, userTeamsTable.teamId))
				.where(
					and(
						eq(userTeamsTable.userId, userId),
						eq(teamsTable.workspaceId, workspaceId),
					),
				)
				.then((results) => results.map((t) => t.Team));

			return c.superjson(teams);
		}),

	getWorkspaceTeams: baseProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { workspaceId } = input;
			const { db, logger } = ctx;
			logger.info("Finding workspace teams");

			const teams = await db.transaction(async (tx) => {
				const teams = await tx
					.select()
					.from(teamsTable)
					.where(eq(teamsTable.workspaceId, workspaceId));

				return teams;
			});

			return c.superjson(teams);
		}),

	removeUserFromTeam: baseProcedure
		.input(
			z.object({
				userId: z.string(),
				teamId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { userId, teamId } = input;
			const { db, logger } = ctx;
			logger.info("Removing user from team");

			const result = await db.transaction(async (tx) => {
				const deleteResult = await tx
					.delete(userTeamsTable)
					.where(
						and(
							eq(userTeamsTable.userId, userId),
							eq(userTeamsTable.teamId, teamId),
						),
					)
					.returning();

				if (deleteResult.length === 0) {
					throw new HTTPException(404, {
						message: "User-team association not found",
					});
				}

				return { success: true };
			});

			return c.superjson(result);
		}),
});
