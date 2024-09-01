import type { Task } from "@repo/db";

export type TaskState = {
	tasks: Task[];
};

export type TaskActions = {
	addTask: (task: Task) => Promise<Task>;
	updateTask: (taskId: string, task: Partial<Task>) => Promise<Task>;
	deleteTask: (taskId: string) => void;
	getTask: (taskId: string) => Promise<Task | undefined>;
	getAllTasks: (teamId: string) => Promise<Task[]>;
};

export type TaskStore = TaskState & TaskActions;
