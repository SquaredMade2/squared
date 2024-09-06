import type { Notification } from "@repo/db";

export type NotificationState = {
	notifications: Notification[];
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
	deleteNotification: (notificationId: string) => Promise<void>;
	getAllNotifications: (userId: string) => Promise<Notification[]>;
	clearNotifications: (userId: string) => Promise<Notification[]>;
};

export type NotificationStore = NotificationState & NotificationActions;
