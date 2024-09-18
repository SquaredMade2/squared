import type { Notification, Task, Workspace } from "@repo/db";

export type NotificationState = {
	notifications: NotificationTask[];
};

export type NotificationTask = Notification & {
	Task: Task;
	Workspace: Workspace;
};

export interface NotificationResponse {
	notification: Notification | null;
	message?: string;
	variant: "default" | "destructive";
}

export type NotificationActions = {
	addNotification: (
		notification: Partial<Notification>,
	) => Promise<NotificationResponse>;
	updateNotification: (
		notificationId: string,
		notification: Partial<Notification>,
	) => Promise<NotificationResponse>;
	deleteNotification: (notificationId: string) => Promise<void>;
	getAllNotifications: (userId: string) => Promise<Notification[]>;
	clearNotifications: (userId: string) => Promise<Notification[]>;
};

export type NotificationStore = NotificationState & NotificationActions;
