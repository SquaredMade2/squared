import type { Task } from "@squared/db";

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
	setCurrentTask: (task: Task) => void;
	setTasks: (tasks: Task[]) => void;
};

export type TaskStore = TaskState & TaskActions;
