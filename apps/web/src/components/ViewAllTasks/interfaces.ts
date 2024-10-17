import type { Status, Task } from "@repo/db";

export type GroupedColumn = {
	group: string;
	tasks: Task[];
};
export interface ViewAllTasksProps {
	getGroupedColumns: () => GroupedColumn[];
	allowedColumns?: Status[];
	sprintId?: string;
}

export interface GroupColumnProps {
	group: string;
	tasks: Task[];
	currentView: "list" | "grid";
	sprintId?: string;
}

export type TaskColumnTitleProps = {
	isListView: boolean;
	showTasks: boolean;
	title: string;
	numberOfTasks: number;
	setShowTasks: (input: boolean) => void;
	sprintId?: string;
};

export interface HideStatusProps {
	setShowTasks: (input: boolean) => void;
	showTasks: boolean;
}
