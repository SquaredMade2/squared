import type { Task } from "@repo/db";
import type { ApiReturnType } from "../interfaces";

export type TaskState = {
	tasks: Task[];
	currentTask: Task | null;
};

export interface TaskResponse {
	task: Task | null;
	message?: string;
	variant: "default" | "destructive";
}

type TaskActions = {
	addTask: (task: Partial<Task>) => Promise<TaskResponse>;
	updateTask: (taskId: string, task: Partial<Task>) => Promise<TaskResponse>;
	setCurrentTask: (task: Task) => void;
	deleteTask: (taskId: string) => Promise<void>;
	setTaskList: (tasks: Task[]) => void;
	getTask: (taskId: string) => Promise<TaskResponse>;
	getTaskByIdentifier: (
		workspaceId: string,
		taskIdentifier: string,
	) => Promise<TaskResponse>;
	getAllTasks: (teamId: string) => Promise<Task[]>;
	toggleSprintTasks: (
		teamId: string,
		sprintId: string,
		type: "add" | "remove",
	) => Promise<ApiReturnType<Task[]>>;
};

export type TaskStore = TaskState & TaskActions;
