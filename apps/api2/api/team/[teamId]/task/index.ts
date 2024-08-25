import type { Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	teamId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async ({ teamId }, query) => {
			try {
				// Find tasks by team ID
				const tasks: Task[] | null = await prisma.task.findMany({
					where: { teamId },
				});

				if (!tasks) {
					throw new Error("Tasks not found");
				}

				// Return the found tasks
				return tasks;
			} catch (error) {
				console.error("Error finding tasks:", error);
				throw new Error("Internal server error");
			}
		},
	};
}
