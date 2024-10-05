import type { Task, Label, User } from "@repo/db";

export interface TaskGridProps {
	task: Task;
	user?: User;
	taskLabels: Label[];
	currentWorkspaceUrl?: string;
}

export interface TaskListProps {
	highlightText?: (text: string) => React.ReactNode;
	location: string;
	task: Task;
	user?: User;
	taskLabels: Label[];
	currentWorkspaceUrl?: string;
}

export interface TaskCardProps {
	task: Task;
	index: number;
	highlightText?: (text: string) => React.ReactNode;
	location: string;
}

export interface TaskCardLabelsProps {
	labels: Label[];
}
