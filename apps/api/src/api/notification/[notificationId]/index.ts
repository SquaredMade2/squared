import type { Notification } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	notificationId: string;
};

const logger = createCustomLogger("notification");

export function createRoute(): Route<Params> {
	return {
		POST: async (
			res,
			{ notificationId },
			body,
		): Promise<APIResponse<Notification>> => {
			try {
				logger.info("Creating notification: %0", { notificationId, body });
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
				logger.error("Error creating notification: %0", error);
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
				logger.info("Deleting notification: %s", notificationId);
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
				logger.error("Error deleting notification: %0", error);
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
				logger.info("Updating notification: %0", { notificationId, body });
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
				logger.error("Error updating notification: %0", error);
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
