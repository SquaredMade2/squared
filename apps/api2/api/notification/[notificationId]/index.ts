import type { Notification } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	notificationId: string;
};
type NotificationReturn = {
	notification : Notification | null,
	message: string,
	variant: "default" | "destructive"
}
export function createRoute(): Route<Params> {
	return {
		POST: async (res, { notificationId }, body): Promise<NotificationReturn> => {
			try {
				const existingUser = await prisma.user.findUnique({
					where: { id: body.userId },
				});

				if (!existingUser) {
					return {
						notification: null,
						message: "Cannot find user",
						variant: "destructive"
					};
				}

				const newNotification = await prisma.notification.create({
					data: {
						id: notificationId,
						...body,
					} as Notification,
				});

				if (!newNotification) {
					return {
						notification: null,
						message: "notification not created",
						variant: "destructive"
					};
				}

				// Return the new notification
				return {
					notification: newNotification,
					message: "",
					variant: "default"
				};
			} catch (error) {
				console.error("Error creating notification:", error);
				return {
					notification: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		DELETE: async (res, { notificationId }): Promise<NotificationReturn> => {
			try {
				const notification: Notification | null =
					await prisma.notification.delete({
						where: { id: notificationId },
					});
				if (!notification) {
					return {
						notification: null,
						message: "Notification not found",
						variant: "destructive"
					};
				}

				// Return success message
				return {
					notification: null,
					message: "Notification deleted",
					variant: "default"
				};
			} catch (error) {
				console.error("Error deleting notification:", error);
				return {
					notification: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
	};
}
