import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squaredmade/rpc";
import z from "zod";
import { labelSchema, statusEnum, taskSchema } from "../schema";
import type { CreateTaskParams, TaskRpc, UpdateTaskParams } from "./types";

const createTaskParams = createSchema<CreateTaskParams>()(
	z.object({
		authorId: z.string(),
		title: z.string(),
		description: z.string().optional(),
		dueDate: z.date().optional().nullable(),
		effortEstimate: z.number().min(1).max(5).optional().nullable(),
		teamId: z.string(),
		status: statusEnum.optional(),
		priority: z
			.enum(["noPriority", "urgent", "high", "medium", "low"])
			.optional(),
		labels: z.array(labelSchema).optional(),
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
		dueDate: z.date().nullable().optional(),
		effortEstimate: z.number().min(1).max(5).optional(),
		status: statusEnum.optional(),
		priority: z
			.enum(["noPriority", "urgent", "high", "medium", "low"])
			.optional(),
		assigneeId: z.string().nullable().optional(),
		labels: z.array(labelSchema).optional(),
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
		output: z.object({ success: z.boolean() }),
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
		output: z.array(taskSchema),
	},
	reorderSubtasks: {
		input: z.object({
			parentId: z.string(),
			newOrder: z.array(z.string()),
		}),
		output: z.array(taskSchema),
	},
	updateBlockedOrBlockingTasks: {
		input: z.object({
			updatingIds: z.array(z.string()),
			taskId: z.string(),
			key: z.enum(["blockedBy", "blocking"]),
		}),
		output: z.array(taskSchema),
	},
	getTaskBlockedByAndBlocking: {
		input: z.object({ taskId: z.string() }),
		output: z.object({
			blockedBy: z.array(taskSchema),
			blockingIds: z.array(z.string()),
		}),
	},
	getAllBlockedTaskIds: {
		input: z.object({ teamId: z.string() }),
		output: z.array(z.string()),
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
		updateBlockedOrBlockingTasks: (input) =>
			taskService.updateBlockedOrBlockingTasks(input),
		getTaskBlockedByAndBlocking: (input) =>
			taskService.getTaskBlockedByAndBlocking(input),
		getAllBlockedTaskIds: (input) => taskService.getAllBlockedTaskIds(input),
		getSubtasks: (input) => taskService.getSubtasks(input),
	});

export { TaskService } from "./task-service";
