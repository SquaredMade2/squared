import type { Task } from "@/storeZ";

export interface TaskCardTitleProps {
	taskTitle: string;
	task: Task;
	isShown: boolean;
	highlightText: (taskTitle: string) => string | React.ReactNode;
	location: string;
}
