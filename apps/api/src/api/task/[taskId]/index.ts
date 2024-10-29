import type { Task } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import { trackChange, subscribeUser } from "@/utils/taskUpdate";
import createCustomLogger from "@squared/logger";

type Params = {
	taskId: string;
};

const logger = createCustomLogger("task");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { taskId }): Promise<APIResponse<Task>> => {
			try {
				// Find the task by its ID
				logger.info("Finding task by ID: %s", taskId);
				const task = await prisma.task.findUnique({
					where: { id: taskId },
				});

				if (!task) {
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
				logger.error("Error finding task: %0", error);
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
				logger.info("Updating task by ID: %s", taskId);
				const task = await prisma.task.update({
					where: { id: taskId },
					data: body,
				});

				if (!task) {
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
					return {
						data: null,
						message: "User not found",
						variant: "destructive",
					};
				}

				trackChange(author, body, task);
				subscribeUser(author, task);

				// Return the updated task with labels
				return {
					data: task,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error updating task:", error);
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
				logger.info("Creating task by ID: %s", taskId);
				const existingTask = await prisma.task.findUnique({
					where: { id: taskId },
				});

				if (existingTask) {
					return {
						data: null,
						message: "Task already exists",
						variant: "destructive",
					};
				}

				const { id, ...taskData } = body;

				const workspace = await prisma.workspace.findUnique({
					where: { id: body.workspaceId },
				});

				if (!workspace) {
					throw new Error("Workspace not found");
				}

				const author = await prisma.user.findFirst({
					where: { id: taskData.authorId },
				});

				if (!author) {
					return {
						data: null,
						message: "User not found",
						variant: "destructive",
					};
				}

				// Get the team
				const team = await prisma.team.findUnique({
					where: { id: body.teamId },
				});

				if (!team) {
					return {
						data: null,
						message: "Team not found",
						variant: "destructive",
					};
				}

				// Get all tasks for the team
				const teamTasks = await prisma.task.findMany({
					where: { teamId: body.teamId },
					select: { identifier: true },
				});

				// Extract the task numbers and find the highest one
				const taskNumbers = teamTasks.map((task) => {
					const [_, number] = task.identifier.split("-");
					return Number.parseInt(number, 10);
				});

				const highestTaskNumber = Math.max(0, ...taskNumbers);

				// Generate the new task identifier
				const newTaskNumber = highestTaskNumber + 1;
				const newTaskIdentifier = `${team.identifier}-${newTaskNumber.toString()}`;

				const newIssueCount = workspace.tasksCreated + 1;

				await prisma.workspace.update({
					where: { id: workspace.id },
					data: { tasksCreated: newIssueCount },
				});

				const newTask = await prisma.task.create({
					data: {
						...taskData,
						identifier: newTaskIdentifier,
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

				subscribeUser(author, newTask);

				// Return the new task
				return {
					data: newTask,
					message: `Successfully Created New Task: ${newTask.title}`,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error creating task: %0", error);
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
				logger.info("Deleting task by ID: %s", taskId);
				const task = await prisma.task.delete({
					where: { id: taskId },
				});
				if (!task) {
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
				logger.error("Error deleting task: %0", error);
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
