import type { Label, Task, TaskLabels } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	teamId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (
			res,
			{ teamId },
			query,
		): Promise<APIResponse<Task & { labels: Label[] }>> => {
			try {
				// Find tasks by team ID
				const tasks = await prisma.task.findMany({
					where: { teamId },
					include: {
						TaskLabels: {
							include: {
								Label: true,
							},
						},
					},
				});

				if (!tasks) {
					res.status(404);
					return {
						data: null,
						message: "Tasks not found",
						variant: "destructive",
					};
				}
				const mappedTasks = tasks.map((task) => {
					const labels = task.TaskLabels.map((taskLabel) => taskLabel.Label);
					const { TaskLabels, ...taskData } = task;
					return {
						...taskData,
						labels,
					};
				});

				// Return the found tasks
				return {
					data: mappedTasks,
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
		PUT: async (
			res,
			{ teamId },
			body,
		): Promise<APIResponse<Task & { labels: Label[] }>> => {
			try {
				// Map through tasks and update them
				const updates = body.map((task: Task & { labels: Label[] }) => {
					return prisma.task.update({
						where: { id: task.id },
						data: {
							// Spread other task fields
							title: task.title,
							description: task.description,
							status: task.status,
							priority: task.priority,
							displayOrder: task.displayOrder,
							// Connect to the Author by authorId
							Author: {
								connect: { id: task.authorId }, // Ensure you are connecting the author
							},
							// Update task labels
							TaskLabels: {
								deleteMany: {}, // Remove existing task-label relations
								create: task.labels.map((label: Label) => ({
									labelId: label.id,
								})),
							},
						},
						include: {
							TaskLabels: {
								include: {
									Label: true,
								},
							},
						},
					});
				});

				const tasks: ({
					TaskLabels: ({
						Label: Label;
					} & TaskLabels)[];
				} & Task)[] = await prisma.$transaction(updates);

				if (!tasks) {
					res.status(404);
					return {
						data: null,
						message: "Tasks not found",
						variant: "destructive",
					};
				}

				// Map and include labels for the response
				const mappedTasks = tasks.map((task) => {
					const labels = task.TaskLabels.map((taskLabel) => taskLabel.Label);
					const { TaskLabels, ...taskData } = task;
					return {
						...taskData,
						labels,
					};
				});

				return {
					data: mappedTasks,
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
