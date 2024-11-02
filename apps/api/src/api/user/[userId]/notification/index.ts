import type { Notification, Task, User } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	userId: string;
};

const logger = createCustomLogger("user");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<Notification>> => {
			try {
				// Find the task by its ID
				logger.info("Getting user notifications: %s", userId);
				const user: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});

				if (!user) {
					return {
						data: null,
						message: "User not found",
						variant: "destructive",
					};
				}

				// Find notifications assigned to user
				const notifications: (Notification & { Task: Task })[] =
					await prisma.notification.findMany({
						where: { userId },
						include: {
							Task: true,
						},
					});

				// Return the found notifications
				return {
					data: notifications,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error finding notifications: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		DELETE: async (res, { userId }): Promise<APIResponse<Notification>> => {
			try {
				logger.info("Clearing user notifications: %s", userId);
				await prisma.notification.deleteMany({
					where: { userId },
				});

				// Return success message
				return {
					data: null,
					message: "Notifications cleared",
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
	};
}
