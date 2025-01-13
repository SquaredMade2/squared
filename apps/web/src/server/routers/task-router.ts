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
	updateStatus: privateProcedure
		.input(
			z.object({
				taskId: z.string(),
				status: statusEnum,
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, user } = ctx;
			const { taskId, status } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					updaterId: user.id,
					status,
				}),
			);
		}),
	createTask: privateProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string().optional(),
				status: statusEnum.optional(),
				priority: priorityEnum.optional(),
				labels: z.array(z.string()).optional(),
				dueDate: z.date().nullable().optional(),
				effortEstimate: z.number().nullable().optional(),
				teamId: z.string(),
				workspaceId: z.string(),
				sprintId: z.string().optional().nullable(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, user } = ctx;

			const { transformedInput: transformedTitle } = transformingMentionInputs(
				input.title,
			);
			const { transformedInput: transformedDescription } =
				transformingMentionInputs(input.description || "");

			const newTask = {
				...input,
				authorId: user.id,
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
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, user } = ctx;
			const { taskId, parentId } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					parentId,
					updaterId: user.id,
				}),
			);
		}),
	updateDueDate: privateProcedure
		.input(
			z.object({
				taskId: z.string(),
				dueDate: z.date().nullable(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, user } = ctx;
			const { taskId, dueDate } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					dueDate,
					updaterId: user.id,
				}),
			);
		}),
	updateAssignee: privateProcedure
		.input(
			z.object({
				taskId: z.string(),
				assigneeId: z.string().nullable(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, user } = ctx;
			const { taskId, assigneeId } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					assigneeId,
					updaterId: user.id,
				}),
			);
		}),
	updateMetadata: privateProcedure
		.input(
			z.object({
				taskId: z.string(),
				title: z.string().optional(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { taskService, user } = ctx;
			const { taskId, title, description } = input;
			return c.superjson(
				await taskService.updateTask(TODO, {
					id: taskId,
					title,
					description,
					updaterId: user.id,
				}),
			);
		}),
});
