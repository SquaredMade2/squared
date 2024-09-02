import type { Task } from "@repo/db";
import type { Dispatch, SetStateAction } from "react";

export interface StatusColumnProps {
	columnType: string;
	title: string;
	setShowRenameModal?: Dispatch<SetStateAction<boolean>>;
	setTaskData?: Dispatch<SetStateAction<Task | null>>;
	tasks: Task[];
}
