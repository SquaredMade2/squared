import type { Task } from "@/store/taskData/taskData.interfaces";

export interface TaskCardProps {
	filteredTasks: Task[];
	setShowRenameModal?: (show: boolean) => void;
	highlightText: (text: string) => string | React.ReactNode;
	location: string;
}
