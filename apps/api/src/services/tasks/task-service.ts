import { subscribeUser } from "@/utils/taskUpdate";
import type { PrismaClient, Task } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import { EventService } from "../events/event-service";
import type { CreateTaskParams, TaskRpc, UpdateTaskParams } from "./types";

export class TaskService implements TaskRpc {
	private readonly db: PrismaClient;
	private readonly logger: Logger;
	private readonly eventService: EventService;

	constructor(db: PrismaClient, eventService: EventService) {
		this.db = db;
		this.logger = createCustomLogger("tasks");
		this.eventService = eventService;
	}

	async createTask({
		authorId,
		title,
		description,
		dueDate,
		effortEstimate,
		teamId,
		status,
		priority,
		labels,
		parentId,
	}: CreateTaskParams): Promise<Task> {
		this.logger.info("Creating task by payload: %0", {
			authorId,
			title,
			description,
			dueDate,
			effortEstimate,
			teamId,
			status,
			priority,
			labels,
			parentId,
		});

		const team = await this.db.team.findUnique({
			where: { id: teamId },
			include: {
				Workspace: true,
			},
		});
		if (!team) {
			this.throwError("Team not found");
		}

		const workspace = team.Workspace;
		if (!workspace) {
			this.throwError("Workspace not found");
		}

		const author = await this.db.user.findFirst({
			where: { id: authorId },
		});

		if (!author) {
			this.throwError("Author not found");
		}

		if (effortEstimate) {
			// check if effort estimate is valid
			const effort = Number(effortEstimate);
			if (
				effort < 0 ||
				Number.isNaN(effort) ||
				!Number.isInteger(effort) ||
				effort > 5
			) {
				this.throwError("Invalid Effort Estimate supplied");
			}
		}

		// Get all tasks for the team
		const teamTasks = await this.db.task.findMany({
			where: { teamId },
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

		const newTaskCount = workspace.tasksCreated + 1;

		await this.db.workspace.update({
			where: { id: workspace.id },
			data: { tasksCreated: newTaskCount },
		});

		const newTask = await this.db.task.create({
			data: {
				authorId,
				title,
				description,
				dueDate,
				effortEstimate,
				teamId,
				labels,
				parentId,
				status,
				priority,
				workspaceId: workspace.id,
				identifier: newTaskIdentifier,
			},
		});

		if (!newTask) {
			this.throwError("There was an issue creating your task");
		}

		subscribeUser(author, newTask, this.db);

		// Return the new task
		return newTask;
	}

	async updateTask(args: UpdateTaskParams): Promise<Task> {
		this.logger.info("Updating task with ID: %s", args.id);

		const previousTask = await this.db.task.findUnique({
			where: { id: args.id },
		});

		if (!previousTask) {
			this.throwError("Task not found");
		}

		if (args.effortEstimate) {
			const effort = Number(args.effortEstimate);
			if (
				effort < 0 ||
				Number.isNaN(effort) ||
				!Number.isInteger(effort) ||
				effort > 5
			) {
				this.throwError("Invalid Effort Estimate");
			}
		}

		const task = await this.db.task.update({
			where: { id: args.id },
			data: args,
		});

		if (!task) {
			this.throwError("There was an issue creating the task");
		}

		this.eventService.createLogEvent({
			taskId: task.id,
			authorId: task.authorId,
			changes: args,
			previousTask,
		});

		return task;
	}

	async deleteTask({ taskId }: { taskId: string }): Promise<void> {
		this.logger.info("Deleting task by ID: %s", taskId);
		const task = await this.db.task.delete({
			where: { id: taskId },
		});
		if (!task) {
			this.throwError("There was an issue deleting the task");
		}
		return;
	}

	async getTask({ taskId }: { taskId: string }): Promise<Task> {
		this.logger.info("Finding task by ID: %s", taskId);
		const task = await this.db.task.findUnique({
			where: { id: taskId },
		});

		if (!task) {
			this.throwError("Task Not Found");
		}

		// Return the found task with labels
		return task;
	}

	async getTaskByIdentifier({
		identifier,
		workspaceId,
	}: { identifier: string; workspaceId: string }): Promise<Task> {
		const task = await this.db.task.findFirst({
			where: { identifier, workspaceId },
		});

		if (!task) {
			this.throwError("Task Not Found");
		}
		return task;
	}

	async getTeamTasks({ teamId }: { teamId: string }): Promise<Task[]> {
		this.logger.info("Getting tasks for team with id: %s", teamId);
		return await this.db.task.findMany({
			where: { teamId },
		});
	}

	async addActiveSprintTasks({
		sprintId,
	}: { sprintId: string }): Promise<number> {
		this.logger.info("Adding active sprints to sprint with id: %s", sprintId);
		const sprint = await this.db.sprint.findUnique({
			where: { id: sprintId },
			include: {
				Team: true,
			},
		});

		if (!sprint) {
			this.throwError("Sprint not found");
		}

		const team = sprint.Team;

		if (!team) {
			this.throwError("Team not found");
		}

		return await this.db.task
			.updateMany({
				where: {
					teamId: team.id,
					sprintId: null,
					status: {
						in: ["inProgress", "todo", "inReview"],
					},
				},
				data: {
					sprintId,
				},
			})
			.then((t) => t.count);
	}

	async addSprintTasks({
		sprintId,
		taskIds,
	}: {
		sprintId: string;
		taskIds: string[];
	}): Promise<number> {
		this.logger.info("Adding tasks to sprint with id %s", sprintId);

		return await this.db.$transaction(async (tx) => {
			// First, update all tasks to the sprint
			const updateResult = await tx.task.updateMany({
				where: {
					id: {
						in: taskIds,
					},
				},
				data: {
					sprintId,
				},
			});

			// Then, update the status of backlog tasks to todo
			await tx.task.updateMany({
				where: {
					id: {
						in: taskIds,
					},
					status: "backlog",
				},
				data: {
					status: "todo",
				},
			});

			return updateResult.count;
		});
	}

	async reorderSubtasks(args: {
		parentId: string;
		newOrder: string[];
	}): Promise<Task[]> {
		const updates = args.newOrder.map((id, index) =>
			this.db.task.update({
				where: { id },
				data: { order: index },
			}),
		);

		await this.db.$transaction(updates);

		return await this.db.task.findMany({
			where: { parentId: args.parentId },
			orderBy: { order: "asc" },
		});
	}

	async getSubtasks({ parentId }: { parentId: string }): Promise<Task[]> {
		return await this.db.task.findMany({
			where: { parentId },
			orderBy: { order: "asc" },
		});
	}

	private throwError(message: string): never {
		this.logger.error(message);
		throw new Error(message);
	}
}
