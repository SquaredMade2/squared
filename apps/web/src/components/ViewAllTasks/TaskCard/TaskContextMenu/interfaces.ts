import type { Task } from "@squared/db";

export interface ContextMenuProps {
	task: Task;
}

export interface AssigneeBoxProps {
	task: Task;
	closeMenu: () => void;
}
