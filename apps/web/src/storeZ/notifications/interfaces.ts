import type { Notification } from "@repo/db";

export type NotificationState = {
	notifications: Notification[];
};

export type NotificationActions = {
	addNotification: (
		notification: Notification,
	) => (state: NotificationState) => Promise<Notification>;
	deleteNotification: (
		notificationId: string,
	) => (state: NotificationState) => void;
	getAllNotifications: (
		userId: string,
	) => (state: NotificationState) => Promise<Notification[]>;
	clearNotifications: (userId: string) => (state: NotificationState) => void;
};

export type NotificationStore = NotificationState & NotificationActions;
