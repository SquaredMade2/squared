import { createNotificationStore } from ".";
import axios from "axios";
import type { Notification } from "@repo/db";
import type { NotificationTask } from "./interfaces";
import {
	STANDARD_NOTIFICATION,
	STANDARD_NOTIFICATION_TASK,
	STANDARD_NOTIFICATION_TASK_2,
	STANDARD_TASK,
	STANDARD_WORKSPACE,
} from "@/test/mocks";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock uuid
jest.mock("uuid", () => ({
	v4: jest.fn(() => "mocked-uuid"),
}));

describe("NotificationStore", () => {
	let store: ReturnType<typeof createNotificationStore>;

	beforeEach(() => {
		store = createNotificationStore();
		jest.clearAllMocks();
	});

	it("should initialize with an empty notifications array", () => {
		const state = store.getState();
		expect(state.notifications).toEqual([]);
	});

	describe("addNotification", () => {
		it("should add a notification and update the state", async () => {
			const mockNotification: Partial<Notification> = {
				userId: "user-1",
				type: "ASSIGNED",
				read: false,
			};

			const mockResponse = {
				data: {
					data: {
						id: "mocked-uuid",
						...mockNotification,
						Task: STANDARD_TASK,
						Workspace: STANDARD_WORKSPACE,
					} as NotificationTask,
					message: "Notification added successfully",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store.getState().addNotification(mockNotification);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining("/api/notification/mocked-uuid"),
				mockNotification,
			);

			expect(result).toEqual({
				notification: mockResponse.data.data,
				message: "Notification added successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.notifications).toHaveLength(1);
			expect(state.notifications[0]).toEqual(mockResponse.data.data);
		});

		it("should handle errors when adding a notification", async () => {
			const mockNotification: Partial<Notification> = {
				userId: "user-1",
				type: "ASSIGNED",
				read: false,
			};

			mockedAxios.post.mockRejectedValue(new Error("Network error"));

			const result = await store.getState().addNotification(mockNotification);

			expect(result).toEqual({
				notification: null,
				message: "Network error",
				variant: "destructive",
			});

			const state = store.getState();
			expect(state.notifications).toHaveLength(0);
		});
	});

	describe("updateNotification", () => {
		it("should update a notification and update the state", async () => {
			store.setState({ notifications: [STANDARD_NOTIFICATION_TASK] });

			const updatedNotification: Partial<Notification> = {
				read: true,
			};

			const mockResponse = {
				data: {
					data: { ...STANDARD_NOTIFICATION_TASK, ...updatedNotification },
					message: "Notification updated successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.updateNotification(STANDARD_NOTIFICATION.id, updatedNotification);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining(
					`/api/notification/${STANDARD_NOTIFICATION.id}`,
				),
				updatedNotification,
			);

			expect(result).toEqual({
				notification: mockResponse.data.data,
				message: "Notification updated successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.notifications).toHaveLength(1);
			expect(state.notifications[0].read).toBe(true);
		});

		it("should handle errors when updating a notification", async () => {
			mockedAxios.put.mockRejectedValue(new Error("Network error"));

			const result = await store
				.getState()
				.updateNotification("notification-1", { read: true });

			expect(result).toEqual({
				notification: null,
				message: "Network error",
				variant: "destructive",
			});
		});
	});

	describe("deleteNotification", () => {
		it("should delete a notification and update the state", async () => {
			store.setState({ notifications: [STANDARD_NOTIFICATION_TASK] });

			mockedAxios.delete.mockResolvedValue({});

			await store.getState().deleteNotification(STANDARD_NOTIFICATION.id);

			expect(mockedAxios.delete).toHaveBeenCalledWith(
				expect.stringContaining(
					`/api/notification/${STANDARD_NOTIFICATION.id}`,
				),
			);

			const state = store.getState();
			expect(state.notifications).toHaveLength(0);
		});

		it("should handle errors when deleting a notification", async () => {
			mockedAxios.delete.mockRejectedValue(new Error("Network error"));

			console.error = jest.fn();

			await store.getState().deleteNotification("notification-1");

			expect(console.error).toHaveBeenCalledWith(
				"Error in deleteNotification:",
				expect.any(Error),
			);
		});
	});

	describe("getAllNotifications", () => {
		it("should fetch all notifications for a user and update the state", async () => {
			const mockNotifications: NotificationTask[] = [
				STANDARD_NOTIFICATION_TASK,
				STANDARD_NOTIFICATION_TASK_2,
			];

			mockedAxios.get.mockResolvedValue({ data: { data: mockNotifications } });

			const result = await store.getState().getAllNotifications("user-1");

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining("/api/user/user-1/notification"),
			);

			expect(result).toEqual(mockNotifications);

			const state = store.getState();
			expect(state.notifications).toEqual(
				mockNotifications.sort(
					(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
				),
			);
		});

		it("should handle errors when fetching all notifications", async () => {
			mockedAxios.get.mockRejectedValue(new Error("Network error"));

			console.error = jest.fn();

			const result = await store.getState().getAllNotifications("user-1");

			expect(console.error).toHaveBeenCalledWith(
				"Error in getAllNotifications:",
				expect.any(Error),
			);
			expect(result).toEqual([]);
		});
	});

	describe("clearNotifications", () => {
		it("should clear all notifications for a user", async () => {
			mockedAxios.get.mockResolvedValue({ data: [STANDARD_NOTIFICATION_TASK] });

			const result = await store.getState().clearNotifications("user-1");

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining("/api/user/user-1/notification"),
			);

			expect(result).toEqual([STANDARD_NOTIFICATION_TASK]);

			const state = store.getState();
			expect(state.notifications).toEqual([STANDARD_NOTIFICATION_TASK]);
		});

		it("should handle errors when clearing notifications", async () => {
			mockedAxios.get.mockRejectedValue(new Error("Network error"));

			console.error = jest.fn();

			const result = await store.getState().clearNotifications("user-1");

			expect(console.error).toHaveBeenCalledWith(
				"Error in clearNotifications:",
				expect.any(Error),
			);
			expect(result).toEqual([]);
		});
	});

	describe("updateManyNotifications", () => {
		it("should update multiple notifications and update the state", async () => {
			const mockNotifications: NotificationTask[] = [
				STANDARD_NOTIFICATION_TASK,
				STANDARD_NOTIFICATION_TASK_2,
			];

			store.setState({ notifications: mockNotifications });

			const updateData: Partial<Notification> = { read: true };

			const mockResponse = {
				data: {
					data: mockNotifications.map((n) => ({ ...n, ...updateData })),
					message: "Notifications updated successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.updateManyNotifications(mockNotifications, updateData);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining("/api/notification"),
				{ notifications: mockNotifications, data: updateData },
			);

			expect(result).toEqual(mockResponse.data.data);

			const state = store.getState();
			expect(state.notifications).toHaveLength(2);
			expect(state.notifications.every((n) => n.read)).toBe(true);
		});

		it("should handle errors when updating many notifications", async () => {
			mockedAxios.put.mockRejectedValue(new Error("Network error"));

			console.error = jest.fn();

			const result = await store
				.getState()
				.updateManyNotifications([], { read: true });

			expect(console.error).toHaveBeenCalledWith(
				"Error in updateManyNotifications:",
				expect.any(Error),
			);
			expect(result).toEqual([]);
		});
	});

	describe("deleteManyNotifications", () => {
		it("should delete multiple notifications and update the state", async () => {
			const mockNotifications: NotificationTask[] = [
				STANDARD_NOTIFICATION_TASK,
				STANDARD_NOTIFICATION_TASK_2,
			];

			store.setState({ notifications: mockNotifications });

			mockedAxios.put.mockResolvedValue({});

			await store.getState().deleteManyNotifications(mockNotifications);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining("/api/notification"),
				{ notifications: mockNotifications },
			);

			const state = store.getState();
			expect(state.notifications).toHaveLength(0);
		});

		it("should handle errors when deleting many notifications", async () => {
			mockedAxios.put.mockRejectedValue(new Error("Network error"));

			console.error = jest.fn();

			await store.getState().deleteManyNotifications([]);

			expect(console.error).toHaveBeenCalledWith(
				"Error in updateManyNotifications:",
				expect.any(Error),
			);
		});
	});
});
