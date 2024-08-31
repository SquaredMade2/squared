import type { Notification } from "@repo/db";

export type NotificationState = {
	notifications: Notification[];
};

export type NotificationActions = {
	addNotification: (notification: Notification) => Promise<Notification>;
	deleteNotification: (notificationId: string) => void;
	getAllNotifications: (userId: string) => Promise<Notification[]>;
	clearNotifications: (userId: string) => void;
};

export type NotificationStore = NotificationState & NotificationActions;
