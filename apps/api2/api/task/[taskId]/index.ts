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
		POST: async (
			res,
			{ taskId },
			body,
		): Promise<APIResponse<Task & { labels: Label[] }>> => {
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

				const { id, labels, teamId, ...taskData } = body;

				const team = await prisma.team.findUnique({
					where: { id: teamId },
					include: { Workspace: true },
				});

				if (!team || !team.Workspace) {
					throw new Error("Workspace not found");
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
						teamId,
						TaskLabels: {
							create: labels.map((label: Label) => ({
								label: { connect: { id: label.id } },
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

				const newLabels = newTask.TaskLabels.map(
					(taskLabel) => taskLabel.Label,
				);

				// Return the new task
				const { TaskLabels, ...task } = newTask;
				return {
					data: { ...task, labels: newLabels },
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
