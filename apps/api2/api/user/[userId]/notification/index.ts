import type { Notification, User } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	userId: string;
};


export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<Notification>> => {
			try {
				// Find the task by its ID
				const user: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});

				if (!user) {
					return {
						data: null,
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
					data: notifications,
					variant: "default"
				};
			} catch (error) {
				console.error("Error finding notifications:", error);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		DELETE: async (res, { userId }): Promise<APIResponse<Notification>> => {
			try {
				await prisma.notification.deleteMany({
					where: { userId },
				});

				// Return success message
				return {
					data: null,
					message: "Notifications cleared",
					variant: "default"
				};
			} catch (error) {
				console.error("Error deleting notification:", error);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
	};
}
