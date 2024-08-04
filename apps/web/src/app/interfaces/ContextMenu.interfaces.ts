import { Task } from "@/store/taskData/taskData.interfaces";

export interface TaskContextMenuProps {
	task: Task;
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
