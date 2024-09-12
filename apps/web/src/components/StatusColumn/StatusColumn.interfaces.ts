import type { Status, Task } from "@repo/db";
import type { Dispatch, SetStateAction } from "react";

export interface StatusColumnProps {
	columnType: Status;
	title: Status;
	setShowRenameModal?: Dispatch<SetStateAction<boolean>>;
	tasks: Task[];
	currentView: "list" | "grid";
}
