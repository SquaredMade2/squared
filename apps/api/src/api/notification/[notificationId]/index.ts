import type { Notification } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	notificationId: string;
};

export function createRoute(): Route<Params> {
	return {
		POST: async (
			res,
			{ notificationId },
			body,
		): Promise<APIResponse<Notification>> => {
			try {
				const existingUser = await prisma.user.findUnique({
					where: { id: body.userId },
				});

				if (!existingUser) {
					return {
						data: null,
						message: "Cannot find user",
						variant: "destructive",
					};
				}

				const newNotification = await prisma.notification.create({
					data: {
						id: notificationId,
						...body,
					},
					include: {
						Task: true,
						Workspace: true,
					},
				});

				if (!newNotification) {
					res.status(500);
					return {
						data: null,
						message: "notification not created",
						variant: "destructive",
					};
				}

				// Return the new notification
				return {
					data: newNotification,
					variant: "default",
				};
			} catch (error) {
				console.error("Error creating notification:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		DELETE: async (
			res,
			{ notificationId },
		): Promise<APIResponse<Notification>> => {
			try {
				const notification: Notification | null =
					await prisma.notification.delete({
						where: { id: notificationId },
					});
				if (!notification) {
					return {
						data: null,
						message: "Notification not found",
						variant: "destructive",
					};
				}

				// Return success message
				return {
					data: null,
					message: "Notification deleted",
					variant: "default",
				};
			} catch (error) {
				console.error("Error deleting notification:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		PUT: async (
			res,
			{ notificationId },
			body,
		): Promise<APIResponse<Notification>> => {
			try {
				const notification = await prisma.notification.update({
					where: { id: notificationId },
					data: body,
					include: {
						Task: true,
						Workspace: true,
					},
				});

				if (!notification) {
					return {
						data: null,
						message: "Notification not found",
						variant: "destructive",
					};
				}

				// Return the updated notification
				return {
					data: notification,
					variant: "default",
				};
			} catch (error) {
				console.error("Error updating notification:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
	};
}
