import type {
	GithubCommit,
	Notification,
	NotificationType,
	Task,
	TaskEvent,
	Workspace,
} from "@squared/db";

export type TaskValue = string | number | boolean | Date | string[] | null;

export type FullNotification = Notification & {
	Workspace: Workspace;
	Task: Task;
};

export type TaskEventsReturn = Promise<(TaskEvent | GithubCommit)[]>;

export interface EventRpc {
	getTaskEvents: ({ taskId }: { taskId: string }) => TaskEventsReturn;
	getNotifications: ({
		userId,
	}: { userId: string }) => Promise<FullNotification[]>;
	createLogEvent: ({
		taskId,
		authorId,
		changes,
		previousTask,
	}: {
		taskId: string;
		authorId: string;
		changes: Partial<Task>;
		previousTask: Task;
	}) => Promise<TaskEvent | null>;
	createNotification: ({
		userId,
		description,
		type,
		taskId,
		workspaceId,
	}: {
		userId: string;
		description: string;
		type: NotificationType;
		taskId: string;
		workspaceId: string;
	}) => Promise<Notification>;
	toggleNotification: ({
		notificationIds,
		read,
		dismissed,
	}: {
		notificationIds: string[];
		read?: boolean;
		dismissed?: boolean;
	}) => Promise<FullNotification[]>;
	deleteNotification: ({
		notificationIds,
	}: { notificationIds: string[] }) => Promise<void>;
}
