import type { Commit, Notification, TaskEvent } from "@squared/db";

export type Event = TaskEvent | Commit;

export interface EventRpc {
	getTaskEvents: ({ taskId }: { taskId: string }) => Promise<Event[]>;
	getNotifications: ({ userId }: { userId: string }) => Promise<Notification[]>;
	createLogEvent: ({
		taskId,
		authorId,
		message,
	}: {
		taskId: string;
		authorId: string;
		message: string;
	}) => Promise<TaskEvent>;
}
