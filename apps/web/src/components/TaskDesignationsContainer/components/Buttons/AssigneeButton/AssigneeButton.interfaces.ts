import type { Task, User } from "@repo/db";

export interface AssigneeButtonProps {
	currentTask: Task | null;
	handleAssigneeChange: (taskId: string, user: User) => void;
}
