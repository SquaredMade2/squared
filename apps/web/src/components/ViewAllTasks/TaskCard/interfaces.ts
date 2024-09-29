import type { Task, Team, Label, User } from "@repo/db";

export interface TaskGridProps {
	task: Task;
	user?: User;
	currentTeam: Team | null;
	taskLabels: Label[];
}

export interface TaskListProps {
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
