import type { Notification, User } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	userId: string;
};

type NotificationResponse = {
	notifications : Notification[] | null,
	message?: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<NotificationResponse> => {
			try {
				// Find the task by its ID
				const user: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});

				if (!user) {
					return {
						notifications: null,
						message: "User not found",
						variant: "destructive"
					};
				}

				// Find notifications assigned to user
				const notifications: Notification[] =
					await prisma.notification.findMany({
						where: { userId },
					});

				// Return the found notifications
				return {
					notifications: notifications,
					variant: "default"
				};
			} catch (error) {
				console.error("Error finding notifications:", error);
				return {
					notifications: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		DELETE: async (res, { userId }): Promise<NotificationResponse> => {
			try {
				await prisma.notification.deleteMany({
					where: { userId },
				});

				// Return success message
				return {
					notifications: null,
					message: "Notifications cleared",
					variant: "default"
				};
			} catch (error) {
				console.error("Error deleting notification:", error);
				return {
					notifications: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
	};
}
