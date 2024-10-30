import type {
	Commit,
	Notification,
	NotificationType,
	TaskEvent,
} from "@squared/db";

export type Event = TaskEvent | Commit;

export type TaskValue = string | number | boolean | Date | string[] | null;

export type TaskEventsReturn = Promise<
	(
		| {
				[key: string]: { oldValue: TaskValue; newValue: TaskValue };
		  }
		| Commit
	)[]
>;

export interface EventRpc {
	getTaskEvents: ({ taskId }: { taskId: string }) => TaskEventsReturn;
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
	createNotification: ({
		userId,
		description,
		type,
		taskId,
	}: {
		userId: string;
		description: string;
		type: NotificationType;
		taskId: string;
	}) => Promise<Notification>;
}
