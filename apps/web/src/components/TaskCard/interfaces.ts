import type { Task, Team, Label, User } from "@repo/db";

export interface TaskGridProps {
	teamIdentifier?: string;
	task: Task;
	user?: User;
	currentTeam: Team | null;
	priorityIcon: React.ReactNode;
	taskLabels: Label[];
}

export interface TaskListProps {
	priorityIcon: React.ReactNode;
	teamIdentifier?: string;
	statusIcon: React.ReactNode;
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
