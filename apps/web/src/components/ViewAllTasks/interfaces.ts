import type { Status, Task } from "@repo/db";

export interface ViewAllTasksProps {
	getTasksForStatus: (status: Status) => Task[];
	allowedColumns?: Status[];
	sprintId?: string;
}

export interface StatusColumnProps {
	columnType: Status;
	title: Status;
	tasks: Task[];
	currentView: "list" | "grid";
	sprintId?: string;
}

export type TaskColumnTitleProps = {
	isListView: boolean;
	showTasks: boolean;
	title: Status;
	numberOfTasks: number;
	setShowTasks: (input: boolean) => void;
	sprintId?: string;
};

export interface HideStatusProps {
	setShowTasks: (input: boolean) => void;
	showTasks: boolean;
}
