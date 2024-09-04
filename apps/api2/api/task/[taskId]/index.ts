import type { Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	taskId: string;
};

type TaskReturn = {
	task : Task | null,
	message: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { taskId }): Promise<TaskReturn> => {
			try {
				// Find the task by its ID
				const task: Task | null = await prisma.task.findUnique({
					where: { id: taskId },
				});

				if (!task) {
					return {
						task: null,
						message: "Task not found",
						variant: "destructive"
					};
				}

				// Return the found task
				return {
					task: task,
					message: "",
					variant: "default"
				};
			} catch (error) {
				console.error("Error finding task:", error);
				return {
					task: null,
					message: "Internal server error",
					variant: "destructive"
				};
			}
		},
		PUT: async (res, { taskId }, body): Promise<TaskReturn> => {
			try {
				const task: Task | null = await prisma.task.update({
					where: { id: taskId },
					data: body,
				});
				if (!task) {
					return {
						task: null,
						message: "Task not found",
						variant: "destructive"
					};
				}

				// Return the updated task
				return {
					task: task,
					message: "",
					variant: "default"
				};
			} catch (error) {
				console.error("Error updating task:", error);
				return {
					task: null,
					message: "Internal server error",
					variant: "destructive"
				};
			}
		},
		POST: async (res, { taskId }, body): Promise<TaskReturn> => {
			try {
				const existingTask = await prisma.task.findUnique({
					where: { id: taskId },
				});

				if (existingTask) {
					return {
						task: null,
						message: "Task already exists",
						variant: "destructive"
					};
				}

				const newTask = await prisma.task.create({
					data: {
						id: taskId,
						...body,
					} as Task,
				});

				if (!newTask) {
					return {
						task: null,
						message: "Task not created",
						variant: "destructive"
					};
				}

				// Return the new task
				return {
					task: newTask,
					message: "",
					variant: "default"
				};
			} catch (error) {
				console.error("Error creating task:", error);
				return {
					task: null,
					message: "Internal server error",
					variant: "destructive"
				};
			}
		},
		DELETE: async (res, { taskId }): Promise<TaskReturn> => {
			try {
				const task: Task | null = await prisma.task.delete({
					where: { id: taskId },
				});
				if (!task) {
					return {
						task: null,
						message: "Task not found",
						variant: "destructive"
					};
				}

				// Return success message
				return {
					task: null,
					message: "Task deleted",
					variant: "default"
				};
			} catch (error) {
				console.error("Error deleting task:", error);
				return {
					task: null,
					message: "Internal server error",
					variant: "destructive"
				};
			}
		},
	};
}
