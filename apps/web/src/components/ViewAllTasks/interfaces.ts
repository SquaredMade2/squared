import type { Status, Task } from "@squared/db";

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
	showTasks: boolean;
}

export type TaskColumnTitleProps = {
	isListView: boolean;
	showTasks: boolean;
	title: string;
	numberOfTasks: number;
	setShowTasks: (input: boolean) => void;
};
