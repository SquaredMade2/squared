import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Status, Task } from "@repo/db";

export interface ViewAllTasksProps {
	tasks: Task[];
	handleDragEnd: OnDragEndResponder;
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
	toggleShowTasks?: () => void;
};

export interface HideStatusProps {
	toggleShowTasks: () => void;
	showTasks: boolean;
}

export type HideTaskStatusDropdownProps = {
	toggleHideDropdown: () => void;
	showTasks: boolean;
	toggleShowTasks: () => void;
};
