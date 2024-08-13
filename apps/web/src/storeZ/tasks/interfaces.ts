import type { Task } from "@repo/db";

export type TaskActions = {
	addTask: (
		task: Task,
		workspaceId: string,
		teamId: string,
	) => (state: TaskState) => Promise<TaskState>;
};

export type TaskState = {
	tasks: Task[];
};

export type TaskStore = TaskActions & TaskState;
