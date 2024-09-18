import type { Notification, Task, User } from "@repo/db";
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
					res.status(404);
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
							Workspace: true,
						},
					});

				// Return the found notifications
				return {
					data: notifications,
					variant: "default",
				};
			} catch (error) {
				console.error("Error finding notifications:", error);
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
				console.error("Error deleting notification:", error);
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
