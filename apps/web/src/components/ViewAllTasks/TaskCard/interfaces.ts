import type { Task, Team, Label, User } from "@repo/db";

export interface TaskGridProps {
	teamIdentifier?: string;
	task: Task;
	user?: User;
	currentTeam: Team | null;
	taskLabels: Label[];
}

export interface TaskListProps {
	teamIdentifier?: string;
	highlightText?: (text: string) => React.ReactNode;
	location: string;
	task: Task;
	user?: User;
	currentTeam: Team | null;
}

export interface TaskCardProps {
	task: Task;
	index: number;
	highlightText?: (text: string) => React.ReactNode;
	location: string;
}

export interface TaskCardLabelsProps {
	view: string;
	labels: Label[];
}
