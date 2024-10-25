import type { Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	workspaceId: string;
	taskIdentifier: string;
};

const logger = createCustomLogger("workspace");

export function createRoute(): Route<Params> {
	return {
		GET: async (
			res,
			{ taskIdentifier, workspaceId },
		): Promise<APIResponse<Task>> => {
			try {
				// Find the task by its ID
				const task = await prisma.task.findFirst({
					where: { identifier: taskIdentifier, workspaceId },
				});

				if (!task) {
					return {
						data: null,
						message: "Task not found",
						variant: "destructive",
					};
				}

				// Return the found task with labels
				return {
					data: task,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error finding task: %0", error);
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
