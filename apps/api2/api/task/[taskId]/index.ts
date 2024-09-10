import type { Label, Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	taskId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (
			res,
			{ taskId },
		): Promise<APIResponse<Task & { labels: Label[] }>> => {
			try {
				// Find the task by its ID
				const task = await prisma.task.findUnique({
					where: { id: taskId },
					include: {
						TaskLabels: {
							include: {
								Label: true,
							},
						},
					},
				});

				if (!task) {
					res.status(404);
					return {
						data: null,
						message: "Task not found",
						variant: "destructive",
					};
				}

				// Map labels to be returned
				const labels = task.TaskLabels.map((taskLabel) => taskLabel.Label);

				// Return the found task with labels
				return {
					data: { ...task, labels },
					variant: "default",
				};
			} catch (error) {
				console.error("Error finding task:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		PUT: async (
			res,
			{ taskId },
			body,
		): Promise<APIResponse<Task & { labels: Label[] }>> => {
			try {
				const taskData = {
					...body,
					TaskLabels: body.labels
						? {
								deleteMany: {}, // Remove existing labels
								create: body.labels.map((labelId: string) => ({
									label: { connect: { id: labelId } },
								})),
							}
						: undefined,
				};

				const task = await prisma.task.update({
					where: { id: taskId },
					data: taskData,
					include: {
						TaskLabels: {
							include: {
								Label: true,
							},
						},
					},
				});

				if (!task) {
					res.status(404);
					return {
						data: null,
						message: "Task not found",
						variant: "destructive",
					};
				}

				// Map labels to be returned
				const labels = task.TaskLabels.map((taskLabel) => taskLabel.Label);

				// Return the updated task with labels
				return {
					data: { ...task, labels },
					variant: "default",
				};
			} catch (error) {
				console.error("Error updating task:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		// POST and DELETE remain unchanged except for the labels in the returned task
	};
}
