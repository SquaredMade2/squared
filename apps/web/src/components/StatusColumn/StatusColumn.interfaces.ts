import type { Status, Task } from "@repo/db";

export interface StatusColumnProps {
	columnType: Status;
	title: Status;
	tasks: Task[];
	currentView: "list" | "grid";
}
