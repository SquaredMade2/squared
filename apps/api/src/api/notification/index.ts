import type { Notification } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type UpdateNotificationsPayload = {
	notifications: Notification[]; // List of notifications to update
	data: Partial<Notification>; // Data to be applied to each notification
};

const logger = createCustomLogger("notification");

export function createRoute(): Route {
	return {
		PUT: async (
			res,
			_params,
			body: UpdateNotificationsPayload,
		): Promise<APIResponse<Notification[]>> => {
			try {
				logger.info("Updating notifications: %0", body);
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
					// Return the array of updated notifications
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
			} catch (error) {
				logger.error("Error updating notifications: %0", error);
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
