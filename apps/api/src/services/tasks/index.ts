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
		dueDate: z.date().optional(),
		// set max and min once I have internet connection
		effortEstimate: z.number().optional(),
		teamId: z.string(),
		labels: z.array(z.string()),
		parentId: z.string().optional(),
	}),
);

const updateTaskParams = createSchema<UpdateTaskParams>()(
	z.object({
		id: z.string(),
		title: z.string().optional(),
		description: z.string().optional(),
		dueDate: z.date().optional(),
		effortEstimate: z.number().optional(),
		assigneeId: z.string().optional(),
		labels: z.array(z.string()),
	}),
);

export const taskRpcSchema = createServiceSchema<TaskRpc>()({
	createTask: {
		input: createTaskParams,
		output: z.union([taskSchema, z.null()]),
	},
	updateTask: {
		input: updateTaskParams,
		output: z.union([taskSchema, z.null()]),
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
	});

export { TaskService } from "./task-service";
