import type { User, Task } from "@repo/db";

export interface TaskCardStatusProps {
	task: Task;
}

interface SetAssigneeObject {
	taskId: string;
	assignee: User;
}

export type HandleAssigneeChange = (taskId: string, user: User) => void;

export type AssigneeParams = (taskId: string, user: User) => SetAssigneeObject;
