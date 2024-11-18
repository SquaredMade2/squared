import type { Task } from "@squared/db";

export interface ContextMenuProps {
	task: Task;
	type?: "task" | "subtask";
}
