import type { Dispatch, SetStateAction } from "react";
import type { Task } from "@/storeZ";

export interface TaskContextMenuProps {
	task: Task;
	setIsCopied: Dispatch<SetStateAction<boolean>>;
	copyToClipboard: (taskId: string) => void;
}
export interface StatusSubContextMenuProps {
	task: Task;
}
export interface AssigneeSubContextMenuProps {
	task: Task;
}
export interface PrioritySubContextMenuProps {
	task: Task;
}

export interface LabelSubContextMenuProps {
	task: Task;
}

export interface RenameSubContextMenuProps {
	task: Task;
}

export interface DateSubContextMenuProps {
	task: Task;
}
