import type { PublicUserData } from "@clerk/types";
import type { Label, Task } from "@squaredmade/db";

export interface TaskGridProps {
	task: Task;
	user?: PublicUserData;
	taskLabels: Label[];
	currentWorkspaceUrl?: string;
	isSubtask?: boolean;
	isDisabled?: boolean;
}

export interface TaskListProps {
	highlightText?: (text: string) => React.ReactNode;
	location: string;
	task: Task;
	user?: PublicUserData;
	taskLabels: Label[];
	currentWorkspaceUrl?: string;
}

export interface TaskCardProps {
	task: Task;
	index: number;
	highlightText?: (text: string) => React.ReactNode;
	location: string;
	isSubtask?: boolean;
	isDisabled?: boolean;
}

export interface TaskCardLabelsProps {
	labels: Label[];
}

export interface AssigneeBoxProps {
	task: Task;
}
