import type { Status } from "@repo/db";

export type TaskColumnTitleProps = {
	isListView: boolean;
	showTasks: boolean;
	title: Status;
	numberOfTasks: number;
	toggleShowTasks: () => void;
};
