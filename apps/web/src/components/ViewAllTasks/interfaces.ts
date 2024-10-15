import type { TaskGroup } from "@/store/views";
import type { Status, Task } from "@repo/db";

export interface ViewAllTasksProps {
	// getTasksForStatus: (status: Status) => Task[];
	getGroupColumnTitles: (group: TaskGroup) => string[];
	getTasksForGroup: (group: string) => Task[];
	allowedColumns?: Status[];
	sprintId?: string;
	formatColumnTitle: (title: string) => string | undefined;
}

export interface GroupColumnProps {
	group: string;
	tasks: Task[];
	currentView: "list" | "grid";
	sprintId?: string;
	formatColumnTitle: (title: string) => string | undefined;
}

export type TaskColumnTitleProps = {
	isListView: boolean;
	showTasks: boolean;
	title: string;
	numberOfTasks: number;
	setShowTasks: (input: boolean) => void;
	sprintId?: string;
	formatColumnTitle: (title: string) => string | undefined;
};

export interface HideStatusProps {
	setShowTasks: (input: boolean) => void;
	showTasks: boolean;
}
