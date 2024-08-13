import type { Task } from "@repo/db";

export type TaskActions = {
	addTask: (task: Task) => (state: TaskState) => Promise<Task>;
	updateTask: (
		taskId: string,
		task: Partial<Task>,
	) => (state: TaskState) => Promise<Task>;
	deleteTask: (taskId: string) => (state: TaskState) => void;
	getTask: (taskId: string) => (state: TaskState) => Promise<Task>;
	getAllTasks: (teamId: string) => (state: TaskState) => Promise<Task[]>;
};

export type TaskState = {
	tasks: Task[];
};

export type TaskStore = TaskActions & TaskState;
