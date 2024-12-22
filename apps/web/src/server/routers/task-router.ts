import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

const statusEnum = z.enum([
	"backlog",
	"todo",
	"inProgress",
	"inReview",
	"done",
	"canceled",
	"archived",
]);

export const taskRouter = router({
	getTaskByIdentifier: privateProcedure
		.input(z.object({ identifier: z.string(), workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { identifier, workspaceId } = input;
			return c.superjson(
				await taskService.getTaskByIdentifier(TODO, {
					identifier,
					workspaceId,
				}),
			);
		}),
	getSubtasks: privateProcedure
		.input(z.object({ parentId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { parentId } = input;
			return c.superjson(await taskService.getSubtasks(TODO, { parentId }));
		}),
	getAllTasks: privateProcedure
		.input(
			z.object({
				teamId: z.string(),
			}),
		)
		.query(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { teamId } = input;
			return c.superjson(await taskService.getTeamTasks(TODO, { teamId }));
		}),
	updateStatus: privateProcedure
		.input(
			z.object({
				taskId: z.string(),
				status: statusEnum,
				updaterId: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { taskId, status, updaterId } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					updaterId,
					status,
				}),
			);
		}),
});
