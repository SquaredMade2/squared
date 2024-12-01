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
).strict("Create Task Schema unknown params");

const updateTaskParams = createSchema<UpdateTaskParams>()(
	z.object({
		id: z.string(),
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
	}),
).strict();

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
		}).strict(),
		output: z.void(),
	},
	getTask: {
		input: z.object({
			taskId: z.string(),
		}).strict(),
		output: taskSchema,
	},
	getTaskByIdentifier: {
		input: z.object({
			identifier: z.string(),
			workspaceId: z.string(),
		}).strict(),
		output: taskSchema,
	},
	getTeamTasks: {
		input: z.object({
			teamId: z.string(),
		}).strict(),
		output: z.array(taskSchema),
	},
	addActiveSprintTasks: {
		input: z.object({
			sprintId: z.string(),
		}).strict(),
		output: z.number(),
	},
	addSprintTasks: {
		input: z.object({
			sprintId: z.string(),
			taskIds: z.array(z.string()),
		}).strict(),
		output: z.number(),
	},
	reorderSubtasks: {
		input: z.object({
			parentId: z.string(),
			newOrder: z.array(z.string()),
		}).strict(),
		output: z.array(taskSchema),
	},
	getSubtasks: {
		input: z.object({
			parentId: z.string(),
		}).strict(),
		output: z.array(taskSchema),
	},
});

export type TaskRpcSchema = typeof taskRpcSchema;

export const createTaskRpcHandler = (taskService: TaskRpc) =>
	createRpcHandler("task", taskRpcSchema, {
		createTask: async (input) => {
			const {input: inputSchema, output: outputSchema} = taskRpcSchema.createTask;
			inputSchema.parse(input);
			const newTask = await taskService.createTask(input);
			outputSchema.parse(newTask);
			return newTask
		},
		updateTask: async (input) => {
			const {input: inputSchema, output: outputSchema} = taskRpcSchema.updateTask;
			inputSchema.parse(input);
			const updatedTask = await taskService.updateTask(input);
			outputSchema.parse(updatedTask);
			return updatedTask
		},
		deleteTask: async (input) => {
			const {input: inputSchema, output: outputSchema} = taskRpcSchema.deleteTask;
			inputSchema.parse(input);
			const deleteTask = await taskService.deleteTask(input);
			outputSchema.parse(deleteTask);
			return deleteTask
		},
		getTask: async (input) => {
			const {input: inputSchema, output: outputSchema} = taskRpcSchema.getTask;
			inputSchema.parse(input);
			const task = await taskService.getTask(input);
			outputSchema.parse(task);
			return task
		},
		getTaskByIdentifier: async (input) => {
			const {input: inputSchema, output: outputSchema} = taskRpcSchema.getTaskByIdentifier;
			inputSchema.parse(input);
			const task = await taskService.getTaskByIdentifier(input);
			outputSchema.parse(task);
			return task
		},
		getTeamTasks: async (input) => {
			const {input: inputSchema, output: outputSchema} = taskRpcSchema.getTeamTasks;
			inputSchema.parse(input);
			const teamTasks = await taskService.getTeamTasks(input);
			outputSchema.parse(teamTasks);
			return teamTasks
		},
		addActiveSprintTasks: async (input) => {
			const {input: inputSchema, output: outputSchema} = taskRpcSchema.addActiveSprintTasks;
			inputSchema.parse(input);
			const sprintTaskNumber = await taskService.addActiveSprintTasks(input);
			outputSchema.parse(sprintTaskNumber);
			return sprintTaskNumber
		},
		addSprintTasks: async (input) => {
			const {input: inputSchema, output: outputSchema} = taskRpcSchema.addSprintTasks;
			inputSchema.parse(input);
			const sprintTasks = await taskService.addSprintTasks(input);
			outputSchema.parse(sprintTasks);
			return sprintTasks
		},
		reorderSubtasks: async (input) => {
			const {input: inputSchema, output: outputSchema} = taskRpcSchema.reorderSubtasks;
			inputSchema.parse(input);
			const reorderedSubtasks = await taskService.reorderSubtasks(input);
			outputSchema.parse(reorderedSubtasks);
			return reorderedSubtasks
		},
		getSubtasks: async (input) => {
			const {input: inputSchema, output: outputSchema} = taskRpcSchema.getSubtasks;
			inputSchema.parse(input);
			const subTasks = await taskService.getSubtasks(input);
			outputSchema.parse(subTasks);
			return subTasks
		},
	});

export { TaskService } from "./task-service";
