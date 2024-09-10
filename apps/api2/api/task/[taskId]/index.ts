import type { Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	taskId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { taskId }): Promise<APIResponse<Task>> => {
			try {
				// Find the task by its ID
				const task: Task | null = await prisma.task.findUnique({
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

				// Return the found task
				return {
					data: task,
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
		PUT: async (res, { taskId }, body): Promise<APIResponse<Task>> => {
			try {
				const taskData = {
					...body,
					// If labels are included in the body, update them
					TaskLabels: body.labels
						? {
								deleteMany: {}, // Remove existing labels
								create: body.labels.map((labelId: string) => ({
									label: { connect: { id: labelId } },
								})),
							}
						: undefined,
				};
				const task: Task | null = await prisma.task.update({
					where: { id: taskId },
					data: taskData,
					include: {
						TaskLabels: {
							include: {
								Label: true, // Include related labels
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
				// TODO: Implement tasklog event updates

				// Return the updated task
				return {
					data: task,
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
		POST: async (res, { taskId }, body): Promise<APIResponse<Task>> => {
			try {
				const existingTask = await prisma.task.findUnique({
					where: { id: taskId },
				});

				if (existingTask) {
					res.status(401);
					return {
						data: null,
						message: "Task already exists",
						variant: "destructive",
					};
				}

				const { id, labels, ...taskData } = body;
				const newTask = await prisma.task.create({
					data: {
						...taskData,
						TaskLabels: {
							create: labels.map((labelId: string) => ({
								Label: { connect: { id: labelId } },
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

				if (!newTask) {
					res.status(500);
					return {
						data: null,
						message: "Task not created",
						variant: "destructive",
					};
				}

				// Return the new task
				return {
					data: newTask,
					variant: "default",
				};
			} catch (error) {
				console.error("Error creating task:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		DELETE: async (res, { taskId }): Promise<APIResponse<Task>> => {
			try {
				const task: Task | null = await prisma.task.delete({
					where: { id: taskId },
				});
				if (!task) {
					res.status(404);
					return {
						data: null,
						message: "Task not found",
						variant: "destructive",
					};
				}

				// Return success message
				return {
					data: null,
					message: "Task deleted",
					variant: "default",
				};
			} catch (error) {
				console.error("Error deleting task:", error);
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
