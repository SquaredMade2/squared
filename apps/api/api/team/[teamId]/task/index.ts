import type { Label, Task } from "@repo/db";
import { prisma } from "../../..";
import type { Route, APIResponse } from "../../../route";

type Params = {
	teamId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { teamId }, query): Promise<APIResponse<Task>> => {
			try {
				// Find tasks by team ID
				const tasks = await prisma.task.findMany({
					where: { teamId },
				});

				if (!tasks) {
					res.status(404);
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
