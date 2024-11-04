import type { Task } from "@squared/db";

export type CreateTaskParams = {
	authorId: string;
	title: string;
	description?: string;
	dueDate?: Date;
	effortEstimate?: number;
	teamId: string;
	labels: string[];
	parentId?: string;
};

export type UpdateTaskParams = {
	id: string;
	title?: string;
	description?: string;
	dueDate?: Date;
	effortEstimate?: number;
	assigneeId?: string;
	labels?: string[];
};

export interface TaskRpc {
	createTask: (args: CreateTaskParams) => Promise<Task | null>;
	updateTask: (args: UpdateTaskParams) => Promise<Task | null>;
	deleteTask: (args: { taskId: string }) => Promise<void>;
	getTask: (args: { taskId: string }) => Promise<Task>;
	getTaskByIdentifier: (args: {
		identifier: string;
		workspaceId: string;
	}) => Promise<Task>;
	getTeamTasks: (args: { teamId: string }) => Promise<Task[]>;
	addActiveSprintTasks: (args: { sprintId: string }) => Promise<number>;
	addSprintTasks: (args: {
		sprintId: string;
		taskIds: string[];
	}) => Promise<number>;
}
