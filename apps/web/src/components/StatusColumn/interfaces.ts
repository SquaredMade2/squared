import type { Status, Task } from "@repo/db";

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
	toggleShowTasks: () => void;
};
