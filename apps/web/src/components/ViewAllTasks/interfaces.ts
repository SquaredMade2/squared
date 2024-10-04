import type { Status, Task } from "@repo/db";

export interface ViewAllTasksProps {
	getFilteredStatuses: () => Status[];
	getTasksForStatus: (status: Status) => Task[];
	allowedColumns?: Status[];
}

export interface StatusColumnProps {
	columnType: Status;
	title: Status;
	tasks: Task[];
	currentView: "list" | "grid";
}

export type TaskColumnTitleProps = {
	isListView: boolean;
	showTasks: boolean;
	title: Status;
	numberOfTasks: number;
	setShowTasks: (input: boolean) => void;
};

export interface HideStatusProps {
	setShowTasks: (input: boolean) => void;
	showTasks: boolean;
}
