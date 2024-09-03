import type { Assignee } from "@/store/taskData/taskData.interfaces";
import type { Task } from "@repo/db";

export interface TaskCardStatusProps {
	task: Task;
}

export interface TaskCardTopProps {
	task: Task;
}

export interface AssigneeParam {
	id: string | null;
	name: string | null;
}

export interface SetAssigneeObject {
	taskId: string;
	assignee: AssigneeParam;
}

export type SetNoAssignee = (taskId: string) => SetAssigneeObject;

export type HandleAssigneeChange = (taskId: string, user: Assignee) => void;

export type AssigneeParams = (
	taskId: string,
	user: Assignee,
) => SetAssigneeObject;
