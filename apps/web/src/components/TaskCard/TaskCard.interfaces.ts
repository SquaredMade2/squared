import type { Task } from "@/storeZ";

export interface TaskCardProps {
	filteredTasks: Task[];
	setTaskData: ((task: Task) => void) | undefined;
	setShowRenameModal?: (show: boolean) => void;
	highlightText: (text: string) => string | React.ReactNode;
	location: string;
}
