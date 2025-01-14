import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
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

const priorityEnum = z.enum(["noPriority", "low", "medium", "high", "urgent"]);

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
	getTaskBlockedByAndBlocking: privateProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { taskId } = input;
			return c.superjson(
				await taskService.getTaskBlockedByAndBlocking(TODO, { taskId }),
			);
		}),
	getAllBlockedTaskIds: privateProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { teamId } = input;
			return c.superjson(
				await taskService.getAllBlockedTaskIds(TODO, { teamId }),
			);
		}),
	updateBlockedOrBlockingTasks: privateProcedure
		.input(
			z.object({
				taskId: z.string(),
				updatingIds: z.array(z.string()),
				key: z.enum(["blockedBy", "blocking"]),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { taskId, updatingIds, key } = input;
			return c.superjson(
				await taskService.updateBlockedOrBlockingTasks(TODO, {
					taskId,
					updatingIds,
					key,
				}),
			);
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
	createTask: privateProcedure
		.input(
			z.object({
				userId: z.string(),
				title: z.string(),
				description: z.string().optional(),
				status: statusEnum.optional(),
				priority: priorityEnum.optional(),
				labels: z.array(z.string()).optional(),
				dueDate: z.date().nullable().optional(),
				effortEstimate: z.number().nullable().optional(),
				teamId: z.string(),
				workspaceId: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;

			const { transformedInput: transformedTitle } = transformingMentionInputs(
				input.title,
			);
			const { transformedInput: transformedDescription } =
				transformingMentionInputs(input.description || "");

			const newTask = {
				...input,
				authorId: input.userId,
				title: transformedTitle,
				description: transformedDescription,
				status: input.status || "backlog",
				priority: input.priority || "noPriority",
				labels: input.labels || [],
				dueDate: input.dueDate || null,
				effortEstimate: input.effortEstimate || null,
			};

			const task = await taskService.createTask(TODO, newTask);

			if (!task) {
				throw new Error("Failed to create task");
			}

			return c.superjson(task);
		}),
	updateParent: privateProcedure
		.input(
			z.object({
				taskId: z.string(),
				parentId: z.string().nullable(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { taskId, parentId } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					parentId,
					updaterId: input.userId,
				}),
			);
		}),
	updateDueDate: privateProcedure
		.input(
			z.object({
				taskId: z.string(),
				dueDate: z.date().nullable(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { taskId, dueDate } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					dueDate,
					updaterId: input.userId,
				}),
			);
		}),
	updateAssignee: privateProcedure
		.input(
			z.object({
				taskId: z.string(),
				assigneeId: z.string().nullable(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { taskId, assigneeId } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					assigneeId,
					updaterId: input.userId,
				}),
			);
		}),
	updateMetadata: privateProcedure
		.input(
			z.object({
				taskId: z.string(),
				title: z.string().optional(),
				description: z.string().optional(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { taskId, title, description, userId } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					title,
					description,
					updaterId: userId,
				}),
			);
		}),
});
