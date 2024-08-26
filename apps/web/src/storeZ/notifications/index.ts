import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { NotificationState, NotificationStore } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import type { Notification } from "@repo/db";
export * from "./interfaces";

const apiString = (path: string) =>
	`${process.env.SERVER_URL}/api/notification/${path}`;

export const createNotificationStore = (
	initState: NotificationState = { notifications: [] },
) => {
	return createStore<NotificationStore>()((set) => ({
		...initState,
		addNotification: (notification) => async (state) => {
			const response = await axios.post(apiString(uuidv4()), notification);
			set({ notifications: [...state.notifications, response.data] });
			return response.data;
		},
		deleteNotification: (notificationId) => async (state) => {
			await axios.delete(apiString(notificationId));
			set({
				notifications: state.notifications.filter(
					(t) => t.id !== notificationId,
				),
			});
		},
		getAllNotifications: (userId) => async (state) => {
			const response: { data: Notification[] } = await axios.get(
				`${process.env.SERVER_URL}/api/user/${userId}/notification`,
			);
			set({ notifications: response.data });
			return response.data;
		},
		clearNotifications: (userId) => async (state) => {
			const response: { data: Notification[] } = await axios.get(
				`${process.env.SERVER_URL}/api/user/${userId}/notification`,
			);
			set({ notifications: response.data });
			return response.data;
		},
	}));
};
