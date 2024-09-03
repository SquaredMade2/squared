import type { Status } from "@repo/db";

export interface FilterStatusColumnProps {
	columnType: Status;
	title: string;
	handleDeleteTask: (id: string) => void;
}
