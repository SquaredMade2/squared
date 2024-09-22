import type { Notification } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type UpdateNotificationsPayload = {
	notifications: Notification[]; // List of notifications to update
	data: Partial<Notification>; // Data to be applied to each notification
};

export function createRoute(): Route {
	return {
		PUT: async (
			res,
			_params,
			body: UpdateNotificationsPayload,
		): Promise<APIResponse<Notification[]>> => {
			try {
				const { notifications, data } = body;

				if (!Array.isArray(notifications) || notifications.length === 0) {
					res.status(400);
					return {
						data: null,
						message:
							"Invalid request body. Expected a non-empty array of notifications.",
						variant: "destructive",
					};
				}

				// Start a transaction to update all notifications
				if (data) {
					const updatedNotifications = await prisma.$transaction(
						notifications.map((notification) =>
							prisma.notification.update({
								where: { id: notification.id },
								data,
								include: {
									Task: true,
									Workspace: true,
								},
							}),
						),
					);
					return {
						data: updatedNotifications,
						variant: "default",
					};
				}
				await prisma.notification.deleteMany({
					where: {
						id: {
							in: notifications.map((notification) => notification.id),
						},
					},
				});
				return { data: [], variant: "default" };

				// Return the array of updated notifications
			} catch (error) {
				console.error("Error updating notifications:", error);
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
