import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { workspaceProcedure } from "../procedures";

const statusEnum = z.enum([
	"backlog",
	"todo",
	"inProgress",
	"inReview",
	"done",
	"canceled",
	"archived",
	"duplicated",
]);

const priorityEnum = z.enum(["noPriority", "low", "medium", "high", "urgent"]);

const labelSchema = z.object({
	name: z.string(),
	description: z.string().optional().nullable(),
	color: z.string(),
});

export const taskRouter = router({
	getTaskByIdentifier: workspaceProcedure
		.input(z.object({ identifier: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { taskService, workspaceId } = ctx;
			const { identifier } = input;
			return c.superjson(
				await taskService.getTaskByIdentifier(TODO, {
					identifier,
					workspaceId,
				}),
			);
		}),
	getSubtasks: workspaceProcedure
		.input(z.object({ parentId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { parentId } = input;
			return c.superjson(await taskService.getSubtasks(TODO, { parentId }));
		}),
	getAllTasks: workspaceProcedure
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
	getTaskBlockedByAndBlocking: workspaceProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { taskId } = input;
			return c.superjson(
				await taskService.getTaskBlockedByAndBlocking(TODO, { taskId }),
			);
		}),
	getAllBlockedTaskIds: workspaceProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { teamId } = input;
			return c.superjson(
				await taskService.getAllBlockedTaskIds(TODO, { teamId }),
			);
		}),
	updateBlockedOrBlockingTasks: workspaceProcedure
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
	updateStatus: workspaceProcedure
		.input(
			z.object({
				taskId: z.string(),
				status: statusEnum,
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, userId } = ctx;
			const { taskId, status } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					updaterId: userId,
					status,
				}),
			);
		}),
	updatePriority: workspaceProcedure
		.input(
			z.object({
				taskId: z.string(),
				priority: priorityEnum,
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, userId } = ctx;
			const { taskId, priority } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					updaterId: userId,
					priority,
				}),
			);
		}),
	updateEffort: workspaceProcedure
		.input(
			z.object({
				taskId: z.string(),
				effortEstimate: z.number().min(1).max(5),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, userId } = ctx;
			const { taskId, effortEstimate } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					updaterId: userId,
					effortEstimate,
				}),
			);
		}),
	createTask: workspaceProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string().optional(),
				status: statusEnum.optional(),
				priority: priorityEnum.optional(),
				labels: z.array(labelSchema).optional(),
				dueDate: z.date().nullable().optional(),
				effortEstimate: z.number().nullable().optional(),
				teamId: z.string(),
				workspaceId: z.string(),
				sprintId: z.string().optional().nullable(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, userId } = ctx;

			const { transformedInput: transformedTitle } = transformingMentionInputs(
				input.title,
			);
			const { transformedInput: transformedDescription } =
				transformingMentionInputs(input.description || "");

			const newTask = {
				...input,
				authorId: userId,
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
	updateParent: workspaceProcedure
		.input(
			z.object({
				taskId: z.string(),
				parentId: z.string().nullable(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, userId } = ctx;
			const { taskId, parentId } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					parentId,
					updaterId: userId,
				}),
			);
		}),
	updateSprint: workspaceProcedure
		.input(
			z.object({
				taskId: z.string(),
				sprintId: z.string().nullable(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, userId } = ctx;
			const { taskId, sprintId } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					sprintId,
					updaterId: userId,
				}),
			);
		}),

	updateDueDate: workspaceProcedure
		.input(
			z.object({
				taskId: z.string(),
				dueDate: z.date().nullable(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, userId } = ctx;
			const { taskId, dueDate } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					dueDate,
					updaterId: userId,
				}),
			);
		}),
	updateAssignee: workspaceProcedure
		.input(
			z.object({
				taskId: z.string(),
				assigneeId: z.string().nullable(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, userId } = ctx;
			const { taskId, assigneeId } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					assigneeId,
					updaterId: userId,
				}),
			);
		}),
	updateLabels: workspaceProcedure
		.input(
			z.object({
				taskId: z.string(),
				labels: z.array(labelSchema),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, userId } = ctx;
			const { taskId, labels } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					labels: labels,
					updaterId: userId,
				}),
			);
		}),
	updateMetadata: workspaceProcedure
		.input(
			z.object({
				taskId: z.string(),
				title: z.string().optional(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, userId } = ctx;
			const { taskId, title, description } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					title,
					description,
					updaterId: userId,
				}),
			);
		}),
	updateSubtaskOrder: workspaceProcedure
		.input(
			z.object({
				parentId: z.string(),
				newOrder: z.string().array(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { parentId, newOrder } = input;
			return c.superjson(
				await taskService.reorderSubtasks(TODO, {
					parentId,
					newOrder,
				}),
			);
		}),
	setLastViewedTask: workspaceProcedure
		.input(z.object({ taskId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { userService, userId } = ctx;
			const { taskId } = input;
			return c.superjson(
				await userService.setLastViewedTask(TODO, { userId, taskId }),
			);
		}),
	deleteTask: workspaceProcedure
		.input(z.object({ taskId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { taskService } = ctx;
			const { taskId } = input;
			return c.superjson(await taskService.deleteTask(TODO, { taskId }));
		}),
});
