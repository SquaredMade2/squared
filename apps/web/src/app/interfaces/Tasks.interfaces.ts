import type { Task } from "@/store/taskData/taskData.interfaces";
import type { User } from "@repo/db";

export interface TaskCardStatusProps {
	task: Task;
}

export interface TaskCardTopProps {
	task: Task;
}

export interface SetAssigneeObject {
	taskId: string;
	assignee: User;
}

export type SetNoAssignee = (taskId: string) => SetAssigneeObject;

export type HandleAssigneeChange = (taskId: string, user: User) => void;

export type AssigneeParams = (taskId: string, user: User) => SetAssigneeObject;
