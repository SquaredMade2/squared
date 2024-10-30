import type { Commit, Notification, TaskEvent } from "@squared/db";

export type Event = TaskEvent | Commit;

export type TaskValue = string | number | boolean | Date | string[] | null;

export interface EventRpc {
	getTaskEvents: ({ taskId }: { taskId: string }) => Promise<Event[]>;
	getNotifications: ({ userId }: { userId: string }) => Promise<Notification[]>;
	createLogEvent: ({
		taskId,
		authorId,
		changes,
	}: {
		taskId: string;
		authorId: string;
		changes: Partial<TaskEvent>;
	}) => Promise<TaskEvent>;
}
