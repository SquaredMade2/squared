import type { TaskGroup } from "@/store/views";
import type { Status, Task } from "@repo/db";

export interface ViewAllTasksProps {
	getTasksForStatus: (status: Status) => Task[];
	getGroupColumnTitles: (group: TaskGroup) => string[];
	getTasksForGroup: (group: string) => Task[];
	allowedColumns?: Status[];
	sprintId?: string;
}

export interface GroupColumnProps {
	// columnType: Status;
	// title: Status;
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
