import type { Task } from "@repo/db";

export type TaskState = {
	tasks: Task[];
	currentTask: Task | null;
};

export interface TaskResponse {
	task: Task | null;
	message?: string;
	variant: "default" | "destructive";
}

export type TaskActions = {
	addTask: (task: Partial<Task>) => Promise<TaskResponse>;
	updateTask: (taskId: string, task: Partial<Task>) => Promise<TaskResponse>;
	setCurrentTask: (task: Task) => void;
	deleteTask: (taskId: string) => Promise<void>;
	setTaskList: (tasks: Task[]) => void;
	getTask: (taskId: string) => Promise<TaskResponse>;
	getAllTasks: (teamId: string) => Promise<Task[]>;
};

export type TaskStore = TaskState & TaskActions;
