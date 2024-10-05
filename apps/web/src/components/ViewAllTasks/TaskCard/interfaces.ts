import type { Task, Team, Label, User } from "@repo/db";

export interface TaskGridProps {
	task: Task;
	user?: User;
	currentTeam: Team | null;
	taskLabels: Label[];
	isSubtask?: boolean;
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
	isSubtask?: boolean;
}

export interface TaskCardLabelsProps {
	labels: Label[];
}
