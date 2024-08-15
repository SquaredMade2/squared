import { Dispatch, SetStateAction } from "react";
import type { Task } from "@/store/taskData/taskData.interfaces";

export interface TaskCardProps {
	filteredTasks: Task[];
	setTaskData: (taskData: Task) => void;
	setShowRenameModal?: (show: boolean) => void;
	highlightText: (text: string) => string | React.ReactNode;
	location: string;
}
