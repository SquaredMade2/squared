import { Dispatch, SetStateAction } from "react";
import type { Task } from "@repo/db";

export interface TaskCardProps {
	filteredTasks: Task[];
	setTaskData: ((task: Task) => void) | undefined;
	setShowRenameModal?: (show: boolean) => void;
	highlightText: (text: string) => string | React.ReactNode;
	location: string;
}
