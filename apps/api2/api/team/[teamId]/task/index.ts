import type { Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	teamId: string;
};

type TaskResponse = {
	tasks : Task[] | null,
	message?: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { teamId }, query): Promise<TaskResponse> => {
			try {
				// Find tasks by team ID
				const tasks: Task[] | null = await prisma.task.findMany({
					where: { teamId },
				});

				if (!tasks) {
					return {
						tasks: null,
						message: "Tasks not found",
						variant: "destructive"
					};
				}

				// Return the found tasks
				return {
					tasks: tasks,
					variant:"default"
				};
			} catch (error) {
				console.error("Error finding tasks:", error);
				return {
					tasks: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
	};
}
