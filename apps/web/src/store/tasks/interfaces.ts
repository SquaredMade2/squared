import type { Task } from "@squared/db";

export type TaskState = {
	tasks: Task[];
	currentTask: Task | null;
	subtasks: Task[];
	currentTaskBlockedBy: Task[];
	currentTaskBlockingIds: string[];
};

export interface TaskResponse {
	task: Task | null;
	message?: string;
	variant: "default" | "destructive";
}

type TaskActions = {
	setCurrentTask: (task: Task) => void;
	setTasks: (tasks: Task[]) => void;
	setSubtasks: (subtasks: Task[]) => void;
	setCurrentTaskBlockedBy: (tasks: Task[]) => void;
	setCurrentTaskBlockingIds: (ids: string[]) => void;
	updateTask: (task: Task) => void;
	createTask: (task: Task) => void;
	deleteTask: (taskId: string) => void;
};

export type TaskStore = TaskState & TaskActions;
