import type { Priority, Status, Task } from "@squared/db";

export type CreateTaskParams = {
	authorId: string;
	title: string;
	description?: string;
	dueDate?: Date | null;
	effortEstimate?: number | null;
	teamId: string;
	labels?: string[];
	priority?: Priority;
	status?: Status;
	parentId?: string | null;
};

export type UpdateTaskParams = {
	id: string;
	title?: string;
	description?: string;
	dueDate?: Date;
	effortEstimate?: number;
	priority?: Priority;
	status?: Status;
	assigneeId?: string | null;
	labels?: string[];
};

export interface TaskRpc {
	createTask: (args: CreateTaskParams) => Promise<Task>;
	updateTask: (args: UpdateTaskParams) => Promise<Task>;
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
