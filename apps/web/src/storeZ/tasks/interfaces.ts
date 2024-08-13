import type { Task } from "@repo/db";

export type TaskActions = {
	addTask: (
		task: Task,
		workspaceId: string,
		teamId: string,
	) => (state: TaskState) => Promise<Task>;
	updateTask: (
		taskId: string,
		task: Partial<Task>,
		workspaceId: string,
		teamId: string,
	) => (state: TaskState) => Promise<Task>;
	deleteTask: (
		taskId: string,
		workspaceId: string,
		teamId: string,
	) => (state: TaskState) => void;
	getTask: (
		taskId: string,
		workspaceId: string,
		teamId: string,
	) => (state: TaskState) => Promise<Task>;
	getAllTasks: (
		workspaceId: string,
		teamId: string,
	) => (state: TaskState) => Promise<Task[]>;
};

export type TaskState = {
	tasks: Task[];
};

export type TaskStore = TaskActions & TaskState;
