import type { Task, Status } from "@repo/db";
import type { Dispatch, SetStateAction } from "react";

export interface StatusColumnProps {
	columnType: Status;
	title: Status;
	setShowRenameModal?: Dispatch<SetStateAction<boolean>>;
	setTaskData?: Dispatch<SetStateAction<Task | null>>;
	tasks: Task[];
}
