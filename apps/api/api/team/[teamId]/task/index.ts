import type { Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	teamId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { teamId }): Promise<APIResponse<Task>> => {
			try {
				// Find tasks by team ID
				const tasks = await prisma.task.findMany({
					where: { teamId },
				});

				if (!tasks) {
					return {
						data: null,
						message: "Tasks not found",
						variant: "destructive",
					};
				}

				// Return the found tasks
				return {
					data: tasks,
					variant: "default",
				};
			} catch (error) {
				console.error("Error finding tasks:", error);
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
