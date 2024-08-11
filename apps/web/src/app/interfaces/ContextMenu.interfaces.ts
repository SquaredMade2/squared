import { Task } from "@/store/taskData/taskData.interfaces";
import { Dispatch, SetStateAction } from "react";

export interface TaskContextMenuProps {
	task: Task;
	setIsCopied: Dispatch<SetStateAction<boolean>>;
	copyToClipboard: (taskId: string) => void
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