import { baseProcedure, j } from "@/utils/jstack";
import {
	and,
	desc,
	eq,
	inArray,
	ne,
	retrospectiveItemsTable,
	sprintsTable,
	tasksTable,
	teamsTable,
} from "@squaredmade/db";
import { addWeeks } from "date-fns";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";

export const sprintService = j.router({
	getSprints: baseProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { teamId } = input;
			const { db, logger } = ctx;
			logger.info("Getting sprints for team", { teamId });
			const sprints = await db
				.select()
				.from(sprintsTable)
				.where(eq(sprintsTable.teamId, teamId));
			return c.superjson(sprints);
		}),
	updateSprint: baseProcedure
		.input(
			z.object({
				sprintId: z.string(),
				sprintData: z.object({
					startDate: z.date(),
					description: z.string(),
					name: z.string(),
					endDate: z.date(),
				}),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { sprintId, sprintData } = input;
			const { db, logger } = ctx;
			logger.info("Updating sprint", { sprintId });

			const updatedSprint = await db
				.update(sprintsTable)
				.set(sprintData)
				.where(eq(sprintsTable.id, sprintId))
				.returning();

			if (!updatedSprint) {
				return c.superjson({
					status: 404,
					message: "Sprint not found",
					variant: "destructive",
				});
			}
			return c.superjson(updatedSprint);
		}),
	initializeSprints: baseProcedure
		.input(z.object({ teamId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { teamId } = input;
			const { db, logger } = ctx;
			logger.info("Initializing sprints for team", { teamId });
			await db.transaction(async (tx) => {
				const team = await tx
					.select()
					.from(teamsTable)
					.where(eq(teamsTable.id, teamId))
					.limit(1);

				if (team.length === 0) {
					return 0;
				}

				const allSprints = await tx
					.select()
					.from(sprintsTable)
					.where(eq(sprintsTable.teamId, teamId));

				const pendingSprints = allSprints.filter((s) => s.status === "PLANNED");

				if (pendingSprints.length > 0) {
					await tx
						.update(sprintsTable)
						.set({ status: "ACTIVE" })
						.where(eq(sprintsTable.id, pendingSprints[0].id));
					return pendingSprints.length;
				}

				const sprintDuration = team[0].sprintDuration;

				await tx.insert(sprintsTable).values({
					name: `Sprint ${allSprints.length + 1}`,
					status: "ACTIVE",
					startDate: new Date(),
					endDate: addWeeks(new Date(), sprintDuration),
					teamId,
				});
			});

			return c.status(204);
		}),
	startNextSprint: baseProcedure
		.input(
			z.object({
				teamId: z.string(),
				sprintData: z
					.object({
						description: z.string().optional(),
						name: z.string(),
					})
					.optional(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { teamId, sprintData } = input;
			const { db, logger } = ctx;
			logger.info("Starting next sprint for team", { teamId });

			const newSprint = await db.transaction(async (tx) => {
				const team = await tx
					.select()
					.from(teamsTable)
					.where(eq(teamsTable.id, teamId))
					.limit(1);

				if (team.length === 0) {
					throw new HTTPException(404, {
						message: "Team not found",
					});
				}

				if (!team[0].sprintsEnabled) {
					throw new HTTPException(400, {
						message: "Sprints are not enabled for this team",
					});
				}

				const teamSprints = await tx
					.select()
					.from(sprintsTable)
					.where(eq(sprintsTable.teamId, teamId))
					.orderBy(desc(sprintsTable.startDate));

				const currentSprint = teamSprints.find((s) => s.status === "ACTIVE");
				if (currentSprint) {
					await tx
						.update(sprintsTable)
						.set({ status: "COMPLETED" })
						.where(eq(sprintsTable.id, currentSprint.id));
				}

				const lastSprint = teamSprints[0];
				const newSprintNumber =
					(lastSprint ? Number.parseInt(lastSprint.name.split(" ")[1]) : 0) + 1;
				const startDate = new Date();
				const endDate = new Date(startDate);
				endDate.setDate(endDate.getDate() + team[0].sprintDuration * 7);

				const [newSprintData] = await tx
					.insert(sprintsTable)
					.values({
						name: `Sprint ${newSprintNumber}`,
						status: "ACTIVE",
						startDate,
						endDate,
						teamId,
						...sprintData,
					})
					.returning();

				if (currentSprint) {
					const updatedTasks = await tx
						.update(tasksTable)
						.set({ sprintId: newSprintData.id })
						.where(
							and(
								eq(tasksTable.sprintId, currentSprint.id),
								ne(tasksTable.status, "done"),
								ne(tasksTable.status, "canceled"),
								ne(tasksTable.status, "duplicated"),
								ne(tasksTable.status, "archived"),
							),
						)
						.returning({ id: tasksTable.id });

					await tx
						.update(tasksTable)
						.set({ sprintId: newSprintData.id })
						.where(
							and(
								eq(tasksTable.sprintId, currentSprint.id),
								ne(tasksTable.status, "done"),
								ne(tasksTable.status, "canceled"),
								ne(tasksTable.status, "duplicated"),
								ne(tasksTable.status, "archived"),
								inArray(
									tasksTable.parentId,
									updatedTasks.map((t) => t.id),
								),
							),
						);
				}

				return newSprintData;
			});

			return c.superjson(newSprint);
		}),
	getSprintTasks: baseProcedure
		.input(z.object({ sprintId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { sprintId } = input;
			const { db, logger } = ctx;
			logger.info("Getting tasks for sprint", { sprintId });
			return c.superjson(
				await db
					.select()
					.from(tasksTable)
					.where(eq(tasksTable.sprintId, sprintId)),
			);
		}),
	endSprint: baseProcedure
		.input(z.object({ sprintId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { sprintId } = input;
			const { db, logger } = ctx;
			logger.info("Ending sprint", { sprintId });
			const [endedSprint] = await db
				.update(sprintsTable)
				.set({ status: "COMPLETED" })
				.where(eq(sprintsTable.id, sprintId))
				.returning();
			return c.superjson(endedSprint);
		}),
	addRetrospectiveItem: baseProcedure
		.input(
			z.object({
				sprintId: z.string(),
				type: z.enum(["wentWell", "toImprove", "actionItems"]),
				content: z.string(),
				authorId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { sprintId, type, content, authorId } = input;
			const { db, logger } = ctx;
			logger.info("Adding retrospective item", { sprintId, type });
			const [newItem] = await db
				.insert(retrospectiveItemsTable)
				.values({
					sprintId,
					type,
					authorId,
					content,
				})
				.returning();
			return c.superjson(newItem);
		}),
	updateRetrospectiveItem: baseProcedure
		.input(
			z.object({
				retrospectiveItemId: z.string(),
				type: z.enum(["wentWell", "toImprove", "actionItems"]),
				content: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { retrospectiveItemId, type, content } = input;
			const { db, logger } = ctx;
			logger.info("Updating retrospective item", { retrospectiveItemId });
			const [updatedItem] = await db
				.update(retrospectiveItemsTable)
				.set({ type, content })
				.where(eq(retrospectiveItemsTable.id, retrospectiveItemId))
				.returning();
			return c.superjson(updatedItem);
		}),
	likeRetrospectiveItem: baseProcedure
		.input(z.object({ retrospectiveItemId: z.string(), userId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { retrospectiveItemId, userId } = input;
			const { db, logger } = ctx;
			logger.info("Liking retrospective item", { retrospectiveItemId, userId });
			const updatedItem = await db.transaction(async (tx) => {
				const [retroItem] = await tx
					.select()
					.from(retrospectiveItemsTable)
					.where(eq(retrospectiveItemsTable.id, retrospectiveItemId))
					.limit(1);

				if (!retroItem) {
					throw new HTTPException(404, {
						message: "Retrospective item not found",
					});
				}

				const updatedLikes = retroItem.likes.includes(userId)
					? retroItem.likes.filter((id) => id !== userId)
					: [...retroItem.likes, userId];

				const [updatedItem] = await tx
					.update(retrospectiveItemsTable)
					.set({ likes: updatedLikes })
					.where(eq(retrospectiveItemsTable.id, retrospectiveItemId))
					.returning({
						id: retrospectiveItemsTable.id,
						content: retrospectiveItemsTable.content,
						type: retrospectiveItemsTable.type,
						authorId: retrospectiveItemsTable.authorId,
						likes: retrospectiveItemsTable.likes,
						createdAt: retrospectiveItemsTable.createdAt,
					});

				return updatedItem;
			});

			return c.superjson(updatedItem);
		}),
	getRetrospectiveItems: baseProcedure
		.input(z.object({ sprintId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { sprintId } = input;
			const { db, logger } = ctx;
			logger.info("Getting retrospective items for sprint", { sprintId });
			return c.superjson(
				await db
					.select()
					.from(retrospectiveItemsTable)
					.where(eq(retrospectiveItemsTable.sprintId, sprintId)),
			);
		}),
});
