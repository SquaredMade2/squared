import type { Task } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	teamId: string;
};

const logger = createCustomLogger("team");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { teamId }): Promise<APIResponse<Task>> => {
			try {
				// Find tasks by team ID
				logger.info("Finding tasks by team ID: %s", teamId);
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
				logger.error("Error finding tasks: %0", error);
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
