import type { Task } from "@/storeZ";
import type { Status } from "@repo/db";

export interface TaskStatusSectionProps {
	isListView: boolean;
	filteredTasks: Task[];
	setShowRenameModal?: (value: boolean) => void;
	setTaskData?: (taskData: Task) => void;
	showTasks: boolean;
	title: Status;
}
