import type { Label, Task } from "@repo/db";

export interface TaskCardTitleProps {
	taskTitle: string;
	task: Task;
	isShown: boolean;
	highlightText: (taskTitle: string) => string | React.ReactNode;
	location: string;
	labels: Label[];
}
