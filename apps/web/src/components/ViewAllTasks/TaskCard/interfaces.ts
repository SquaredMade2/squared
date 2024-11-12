import type { Label, Task, User } from "@squared/db";

export interface TaskGridProps {
	task: Task;
	user: User | null;
	taskLabels: Label[];
	currentWorkspaceUrl?: string;
	isSubtask?: boolean;
}

export interface TaskListProps {
	highlightText?: (text: string) => React.ReactNode;
	location: string;
	task: Task;
	user: User | null;
	taskLabels: Label[];
	currentWorkspaceUrl?: string;
}

export interface TaskCardProps {
	task: Task;
	index: number;
	highlightText?: (text: string) => React.ReactNode;
	location: string;
	isSubtask?: boolean;
}

export interface TaskCardLabelsProps {
	labels: Label[];
}
