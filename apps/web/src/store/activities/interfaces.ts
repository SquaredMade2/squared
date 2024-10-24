import type { Commit, TaskEvent } from "@repo/db";

export type ActivityState = {
	events: TaskEvent[];
};

type ActivityActions = {
	addTaskEvent: (
		event: TaskEvent,
		taskId: string,
		authorId: string,
	) => Promise<TaskEvent | null>;
	addCommitEvent: (
		event: Commit,
		taskId: string,
		authorId: string,
	) => Promise<TaskEvent | null>;
	getTaskEvents: (taskId: string) => Promise<TaskEvent[]>;
};

export type ActivityStore = ActivityState & ActivityActions;
