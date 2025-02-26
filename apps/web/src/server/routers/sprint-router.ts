import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

const retroTypeEnum = z.enum(["toImprove", "wentWell", "actionItems"]);

export const sprintRouter = router({
	getSprints: privateProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { sprintService } = ctx;
			const { teamId } = input;
			return c.superjson(await sprintService.getSprints(TODO, { teamId }));
		}),
	getSprintTasks: privateProcedure
		.input(z.object({ sprintId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { sprintService } = ctx;
			const { sprintId } = input;
			return c.superjson(
				await sprintService.getSprintTasks(TODO, { sprintId }),
			);
		}),
	addSprintTasks: privateProcedure
		.input(z.object({ sprintId: z.string(), taskIds: z.array(z.string()) }))
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { sprintId, taskIds } = input;
			return c.superjson(
				await taskService.addSprintTasks(TODO, { sprintId, taskIds }),
			);
		}),
	endSprint: privateProcedure
		.input(z.object({ sprintId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { sprintService } = ctx;
			const { sprintId } = input;
			return c.superjson(await sprintService.endSprint(TODO, { sprintId }));
		}),
	getRetro: privateProcedure
		.input(z.object({ sprintId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { sprintService } = ctx;
			const { sprintId } = input;
			return c.superjson(
				await sprintService.getRetrospectiveItems(TODO, { sprintId }),
			);
		}),
	addRetroItem: privateProcedure
		.input(
			z.object({
				sprintId: z.string(),
				type: retroTypeEnum,
				content: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { sprintService, user } = ctx;
			const { sprintId, type, content } = input;
			return c.superjson(
				await sprintService.addRetrospectiveItem(TODO, {
					sprintId,
					type,
					authorId: user.id,
					content,
				}),
			);
		}),
	likeRetroItem: privateProcedure
		.input(
			z.object({
				retroItemId: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { sprintService, user } = ctx;
			const { retroItemId } = input;
			return c.superjson(
				await sprintService.likeRetrospectiveItem(TODO, {
					retrospectiveItemId: retroItemId,
					userId: user.id,
				}),
			);
		}),
	updateRetroItemType: privateProcedure
		.input(
			z.object({
				retrospectiveItemId: z.string(),
				type: retroTypeEnum,
				sprintId: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { sprintService } = ctx;
			const { retrospectiveItemId, type, sprintId } = input;
			return c.superjson(
				await sprintService.updateRetrospectiveItem(TODO, {
					retrospectiveItemId,
					type,
					sprintId,
				}),
			);
		}),
	startNextSprint: privateProcedure
		.input(
			z.object({
				teamId: z.string(),
				sprintData: z
					.object({ name: z.string(), description: z.string() })
					.optional(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { sprintService } = ctx;
			const { teamId, sprintData } = input;
			return c.superjson(
				await sprintService.startNextSprint(TODO, { teamId, sprintData }),
			);
		}),
	updateTeamSprints: privateProcedure
		.input(
			z.object({
				teamId: z.string(),
				data: z
					.object({
						sprintsEnabled: z.boolean().optional(),
						sprintDuration: z.number().optional(),
						cooldownDuration: z.number().optional(),
						sprintStartDate: z.date().optional(),
					})
					.partial(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { teamService } = ctx;
			const { teamId, data } = input;
			return c.superjson(
				await teamService.updateTeamSprints(TODO, { id: teamId, ...data }),
			);
		}),
	initializeSprints: privateProcedure
		.input(z.object({ teamId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { sprintService } = ctx;
			const { teamId } = input;
			return c.json(await sprintService.initializeSprints(TODO, { teamId }));
		}),
	addActiveTasks: privateProcedure
		.input(z.object({ sprintId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { sprintId } = input;
			return c.superjson(
				await taskService.addActiveSprintTasks(TODO, { sprintId }),
			);
		}),
});
