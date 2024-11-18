import type { Task } from "@squared/db";

export type GroupedColumn = {
	group: string;
	tasks: Task[];
};
export interface ViewAllTasksProps {
	getGroupedColumns: () => GroupedColumn[];
	getGroupedRows: () => GroupedColumn[];
	tasks: Task[];
}

export interface GroupColumnProps {
	group: string;
	tasks: Task[];
	currentView: "list" | "grid";
}

export type TaskColumnTitleProps = {
	isListView: boolean;
	showTasks?: boolean;
	title: string;
	numberOfTasks: number;
	setShowTasks?: (input: boolean) => void;
};
