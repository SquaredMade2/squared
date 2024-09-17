import type { Label, Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import { trackChange, createLog } from "@/utils/taskUpdate";

type Params = {
	taskId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { taskId }): Promise<APIResponse<Task>> => {
			try {
				// Find the task by its ID
				const task = await prisma.task.findUnique({
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

				// Return the found task with labels
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
				const task = await prisma.task.update({
					where: { id: taskId },
					data: body,
				});

				if (!task) {
					res.status(404);
					return {
						data: null,
						message: "Task not found",
						variant: "destructive",
					};
				}

				const author = await prisma.user.findFirst({
					where: { id: task.authorId },
				});

				if (!author) {
					res.status(404);
					return {
						data: null,
						message: "User not found",
						variant: "destructive",
					};
				}

				trackChange(author, body, task);

				// Return the updated task with labels
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

				const { id, ...taskData } = body;

				const team = await prisma.team.findUnique({
					where: { id: body.teamId },
					include: { Workspace: true },
				});

				if (!team || !team.Workspace) {
					throw new Error("Workspace not found");
				}

				const author = await prisma.user.findFirst({
					where: { id: taskData.authorId },
				});

				if (!author) {
					res.status(404);
					return {
						data: null,
						message: "User not found",
						variant: "destructive",
					};
				}

				const workspace = team.Workspace;
				const formattedName = workspace.name
					.replace(/\s+/g, "")
					.substring(0, 3)
					.toUpperCase();

				const newIssueCount = (workspace.issuesCreated ?? 0) + 1;

				await prisma.workspace.update({
					where: { id: workspace.id },
					data: { issuesCreated: newIssueCount },
				});

				const identifier = `${formattedName}-${newIssueCount}`;

				const newTask = await prisma.task.create({
					data: {
						...taskData,
						identifier,
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

				createLog(author, newTask);

				// Return the new task
				return {
					data: newTask,
					message: `Successfully Created New Task: ${newTask.title}`,
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
				const task = await prisma.task.delete({
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
