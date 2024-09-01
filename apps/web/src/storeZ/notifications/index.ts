import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { NotificationState, NotificationStore } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import type { Notification } from "@repo/db";
import { persist } from "zustand/middleware";
import { useNotificationStore } from "../provider";
export * from "./interfaces";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/notification/${path}`;

export const createNotificationStore = (
	initState: NotificationState = { notifications: [] },
) => {
	return createStore<NotificationStore>()(
		persist(
			(set) => ({
				...initState,
				addNotification: async (notification) => {
					const response = await axios.post(apiString(uuidv4()), notification);
					const { notifications } = useNotificationStore();
					set({ notifications: [...notifications, response.data] });
					return response.data;
				},
				deleteNotification: async (notificationId) => {
					await axios.delete(apiString(notificationId));
					const { notifications } = useNotificationStore();
					set({
						notifications: notifications.filter((t) => t.id !== notificationId),
					});
				},
				getAllNotifications: async (userId) => {
					const response: { data: Notification[] } = await axios.get(
						`${process.env.NEXT_PUBLIC_SERVERZ}/api/user/${userId}/notification`,
					);
					set({ notifications: response.data });
					return response.data;
				},
				clearNotifications: async (userId) => {
					const response: { data: Notification[] } = await axios.get(
						`${process.env.NEXT_PUBLIC_SERVERZ}/api/user/${userId}/notification`,
					);
					set({ notifications: response.data });
					return response.data;
				},
			}),
			{
				name: "notification-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
