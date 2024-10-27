import { createStore } from "zustand/vanilla";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";
import type {
	NotificationState,
	NotificationStore,
	NotificationResponse,
	NotificationTask,
} from "./interfaces";
import type { Notification } from "@squared/db";
import type { ApiReturnType } from "../interfaces";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/notification/${path}`;

export const createNotificationStore = (
	initState: NotificationState = { notifications: [] },
) => {
	return createStore<NotificationStore>()(
		persist(
			(set, get) => ({
				...initState,
				addNotification: async (
					notification: Partial<Notification>,
				): Promise<NotificationResponse> => {
					try {
						const notificationId = uuidv4();
						const response: { data: ApiReturnType<NotificationTask> } =
							await axios.post(apiString(notificationId), notification);
						const { data: newNotification, message, variant } = response.data;

						if (!newNotification) {
							return { notification: null, message, variant };
						}

						const { notifications } = get();
						set({ notifications: [...notifications, newNotification] });

						return { notification: newNotification, message, variant };
					} catch (error) {
						return {
							notification: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				updateNotification: async (
					notificationId: string,
					notification: Partial<Notification>,
				): Promise<NotificationResponse> => {
					try {
						const response: { data: ApiReturnType<NotificationTask> } =
							await axios.put(apiString(notificationId), notification);
						const updatedNotification = response.data.data;
						if (!updatedNotification) {
							return {
								notification: null,
								message: response.data.message,
								variant: response.data.variant,
							};
						}
						set((state) => ({
							notifications: state.notifications.map((n) =>
								n.id === notificationId ? updatedNotification : n,
							),
						}));
						return {
							notification: updatedNotification,
							message: response.data.message,
							variant: response.data.variant,
						};
					} catch (error) {
						return {
							notification: null,
							message:
								error instanceof Error
									? error.message
									: "Error updating notification",
							variant: "destructive",
						};
					}
				},
				deleteNotification: async (notificationId: string): Promise<void> => {
					try {
						await axios.delete(apiString(notificationId));
						set((state) => ({
							notifications: state.notifications.filter(
								(n) => n.id !== notificationId,
							),
						}));
					} catch (error) {
						console.error("Error in deleteNotification:", error);
					}
				},
				getAllNotifications: async (
					userId: string,
				): Promise<Notification[]> => {
					try {
						const {
							data: response,
						}: { data: ApiReturnType<NotificationTask[]> } = await axios.get(
							`${process.env.NEXT_PUBLIC_SERVER}/api/user/${userId}/notification`,
						);
						const { data: notifications } = response;
						if (!notifications) {
							set({ notifications: [] });
							return [];
						}
						const sortedNotifications = notifications.sort(
							(a: Notification, b: Notification) => {
								return (
									new Date(b.createdAt).getTime() -
									new Date(a.createdAt).getTime()
								);
							},
						);
						set({ notifications: sortedNotifications });
						return notifications;
					} catch (error) {
						console.error("Error in getAllNotifications:", error);
						return [];
					}
				},
				clearNotifications: async (userId: string): Promise<Notification[]> => {
					try {
						const response = await axios.get<NotificationTask[]>(
							`${process.env.NEXT_PUBLIC_SERVER}/api/user/${userId}/notification`,
						);
						set({ notifications: response.data });
						return response.data;
					} catch (error) {
						console.error("Error in clearNotifications:", error);
						return [];
					}
				},
				updateManyNotifications: async (
					notifications: NotificationTask[],
					data: Partial<Notification>,
				): Promise<NotificationTask[]> => {
					try {
						const response: { data: ApiReturnType<NotificationTask[]> } =
							await axios.put(apiString(""), { notifications, data });
						const { data: updatedNotifications } = response.data;
						if (!updatedNotifications) {
							return [];
						}
						set((state) => ({
							notifications: state.notifications.map(
								(n) => updatedNotifications.find((un) => un.id === n.id) || n,
							),
						}));
						return updatedNotifications;
					} catch (error) {
						console.error("Error in updateManyNotifications:", error);
						return [];
					}
				},
				deleteManyNotifications: async (
					notifications: NotificationTask[],
				): Promise<void> => {
					try {
						await axios.put(apiString(""), { notifications });
						set((state) => ({
							notifications: state.notifications.filter(
								(n) => !notifications.some((un) => un.id === n.id),
							),
						}));
					} catch (error) {
						console.error("Error in updateManyNotifications:", error);
					}
				},
			}),
			{
				name: "notification-store",
				storage: {
					getItem: (name) => {
						const storedValue = sessionStorage.getItem(name);
						return storedValue ? JSON.parse(storedValue) : null;
					},
					setItem: (name, value) => {
						sessionStorage.setItem(name, JSON.stringify(value));
					},
					removeItem: (name) => {
						sessionStorage.removeItem(name);
					},
				},
			},
		),
	);
};
