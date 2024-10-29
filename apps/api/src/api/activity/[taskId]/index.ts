import type { Task, TaskEvent } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	taskId: string;
};

const logger = createCustomLogger("activity");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { taskId }): Promise<APIResponse<TaskEvent[]>> => {
			try {
				logger.info("Finding task with ID: %s", taskId);
				// Find the task by its ID
				const task: Task | null = await prisma.task.findUnique({
					where: { id: taskId },
				});

				if (!task) {
					return {
						data: null,
						message: "Task not found",
						variant: "destructive",
					};
				}

				// Find all the activities associated with the task
				const taskEvents = await prisma.taskEvent.findMany({
					where: { taskId },
				});

				if (!taskEvents) {
					return {
						data: null,
						message: "Task event log not found",
						variant: "destructive",
					};
				}

				// Return the found activities
				return {
					data: taskEvents,
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
