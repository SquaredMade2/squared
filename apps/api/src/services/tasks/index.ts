import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import z from "zod";
import { taskSchema } from "../schema";
import type { CreateTaskParams, TaskRpc, UpdateTaskParams } from "./types";

const createTaskParams = createSchema<CreateTaskParams>()(
	z.object({
		authorId: z.string(),
		title: z.string(),
		description: z.string().optional(),
		dueDate: z.date().optional().nullable(),
		effortEstimate: z.number().min(1).max(5).optional().nullable(),
		teamId: z.string(),
		status: z
			.enum([
				"backlog",
				"todo",
				"inProgress",
				"inReview",
				"done",
				"canceled",
				"archived",
			])
			.optional(),
		priority: z
			.enum(["noPriority", "urgent", "high", "medium", "low"])
			.optional(),
		labels: z.array(z.string()).optional(),
		parentId: z.string().nullable().optional(),
		sprintId: z.string().nullable().optional(),
	}),
);

const updateTaskParams = createSchema<UpdateTaskParams>()(
	z.object({
		id: z.string(),
		updaterId: z.string(),
		title: z.string().optional(),
		description: z.string().optional(),
		dueDate: z.date().optional(),
		effortEstimate: z.number().min(1).max(5).optional(),
		status: z
			.enum([
				"backlog",
				"todo",
				"inProgress",
				"inReview",
				"done",
				"canceled",
				"archived",
			])
			.optional(),
		priority: z
			.enum(["noPriority", "urgent", "high", "medium", "low"])
			.optional(),
		assigneeId: z.string().nullable().optional(),
		labels: z.array(z.string()).optional(),
		parentId: z.string().nullable().optional(),
		sprintId: z.string().nullable().optional(),
	}),
);

export const taskRpcSchema = createServiceSchema<TaskRpc>()({
	createTask: {
		input: createTaskParams,
		output: taskSchema,
	},
	updateTask: {
		input: updateTaskParams,
		output: taskSchema,
	},
	deleteTask: {
		input: z.object({
			taskId: z.string(),
		}),
		output: z.void(),
	},
	getTask: {
		input: z.object({
			taskId: z.string(),
		}),
		output: taskSchema,
	},
	getTaskByIdentifier: {
		input: z.object({
			identifier: z.string(),
			workspaceId: z.string(),
		}),
		output: taskSchema,
	},
	getTeamTasks: {
		input: z.object({
			teamId: z.string(),
		}),
		output: z.array(taskSchema),
	},
	addActiveSprintTasks: {
		input: z.object({
			sprintId: z.string(),
		}),
		output: z.number(),
	},
	addSprintTasks: {
		input: z.object({
			sprintId: z.string(),
			taskIds: z.array(z.string()),
		}),
		output: z.number(),
	},
	reorderSubtasks: {
		input: z.object({
			parentId: z.string(),
			newOrder: z.array(z.string()),
		}),
		output: z.array(taskSchema),
	},
	updateBlockedTasks: {
		input: z.object({
			blockingTaskIds: z.array(z.string()),
			taskId: z.string(),
		}),
		output: z.array(taskSchema),
	},
	getBlockedByTasks: {
		input: z.object({ taskId: z.string() }),
		output: z.array(taskSchema),
	},
	getSubtasks: {
		input: z.object({
			parentId: z.string(),
		}),
		output: z.array(taskSchema),
	},
});

export type TaskRpcSchema = typeof taskRpcSchema;

export const createTaskRpcHandler = (taskService: TaskRpc) =>
	createRpcHandler("task", taskRpcSchema, {
		createTask: (input) => taskService.createTask(input),
		updateTask: (input) => taskService.updateTask(input),
		deleteTask: (input) => taskService.deleteTask(input),
		getTask: (input) => taskService.getTask(input),
		getTaskByIdentifier: (input) => taskService.getTaskByIdentifier(input),
		getTeamTasks: (input) => taskService.getTeamTasks(input),
		addActiveSprintTasks: (input) => taskService.addActiveSprintTasks(input),
		addSprintTasks: (input) => taskService.addSprintTasks(input),
		reorderSubtasks: (input) => taskService.reorderSubtasks(input),
		updateBlockedTasks: (input) => taskService.updateBlockedTasks(input),
		getBlockedByTasks: (input) => taskService.getBlockedByTasks(input),
		getSubtasks: (input) => taskService.getSubtasks(input),
	});

export { TaskService } from "./task-service";
