import { j } from "@/api/app";
import { baseProcedure } from "@/middleware";
import { eq, savedFiltersTable } from "@squaredmade/db";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";
import { filterConditionSchema } from "./schema";

export const filterService = j.router({
	createFilter: baseProcedure
		.input(
			z.object({
				name: z.string(),
				description: z.string(),
				filter: z.array(filterConditionSchema).min(1),
				teamId: z.string(),
				authorId: z.string(),
				sprintId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			logger.info("Creating filter with payload", input);
			const [filter] = await db
				.insert(savedFiltersTable)
				.values({
					name: input.name,
					description: input.description,
					type: "TEAM",
					filter: input.filter,
					teamId: input.teamId,
					authorId: input.authorId,
					sprintId: input.sprintId,
				})
				.returning();
			return c.superjson(filter);
		}),

	getFilters: baseProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			logger.info("Getting filters for team with id", input.teamId);
			const filters = await db
				.select()
				.from(savedFiltersTable)
				.where(eq(savedFiltersTable.teamId, input.teamId));
			return c.superjson(filters);
		}),
	updateFilter: baseProcedure
		.input(
			z.object({
				filterId: z.string(),
				filters: z.object({
					name: z.string().optional(),
					description: z.string().nullable(),
					filter: z.array(filterConditionSchema).min(1),
				}),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			logger.info("Updating filter with id", input.filterId);
			const [updatedFilter] = await db
				.update(savedFiltersTable)
				.set({
					name: input.filters.name,
					description: input.filters.description,
					filter: input.filters.filter,
				})
				.where(eq(savedFiltersTable.id, input.filterId))
				.returning();
			if (!updatedFilter) {
				throw new HTTPException(404, {
					message: `Filter with id ${input.filterId} not found`,
				});
			}
			return c.superjson(updatedFilter);
		}),
	deleteFilter: baseProcedure
		.input(z.object({ filterId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			logger.info("Deleting filter with id", input.filterId);
			const result = await db
				.delete(savedFiltersTable)
				.where(eq(savedFiltersTable.id, input.filterId));
			if (result.rowCount === 0) {
				throw new HTTPException(404, {
					message: `Filter with id ${input.filterId} not found`,
				});
			}
			return c.status(204);
		}),
});
