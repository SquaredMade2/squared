import { subscribeUser } from "@/utils/taskUpdate";
import {
	type DBClient,
	type Task,
	and,
	asc,
	blockedTasksTable,
	eq,
	inArray,
	isNull,
	max,
	sprintsTable,
	sql,
	tasksTable,
	teamsTable,
	usersTable,
	workspacesTable,
} from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type { EventService } from "../events/event-service";
import type { CreateTaskParams, TaskRpc, UpdateTaskParams } from "./types";

export class TaskService implements TaskRpc {
	private readonly db: DBClient;
	private readonly logger: Logger;
	private readonly eventService: EventService;

	constructor(db: DBClient, eventService: EventService) {
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
		sprintId,
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

		return await this.db.transaction(async (tx) => {
			// Find team and associated workspace
			const teamWithWorkspace = await tx
				.select({
					team: teamsTable,
					workspace: workspacesTable,
				})
				.from(teamsTable)
				.leftJoin(
					workspacesTable,
					eq(teamsTable.workspaceId, workspacesTable.id),
				)
				.where(eq(teamsTable.id, teamId))
				.limit(1)
				.then((results) => results[0]);

			if (!teamWithWorkspace) {
				this.throwError("Team not found");
			}

			const { team, workspace } = teamWithWorkspace;

			if (!workspace) {
				this.throwError("Workspace not found");
			}

			// Find author
			const author = await tx
				.select()
				.from(usersTable)
				.where(eq(usersTable.externalId, authorId))
				.limit(1)
				.then((results) => results[0]);

			if (!author) {
				this.throwError("Author not found");
			}

			// Validate effort estimate
			if (effortEstimate) {
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

			// Get highest task number for the team
			const highestTaskNumber = await tx
				.select({
					maxNumber: max(
						sql`CAST(SUBSTRING_INDEX(${tasksTable.identifier}, '-', -1) AS UNSIGNED)`,
					),
				})
				.from(tasksTable)
				.where(eq(tasksTable.teamId, teamId))
				.then((result) => result[0]?.maxNumber || 0);

			// Generate new task identifier
			const newTaskNumber = Number(highestTaskNumber) + 1;
			const newTaskIdentifier = `${team.identifier}-${newTaskNumber.toString()}`;

			// Update workspace task count
			const [updatedWorkspace] = await tx
				.update(workspacesTable)
				.set({ tasksCreated: sql`${workspacesTable.tasksCreated} + 1` })
				.where(eq(workspacesTable.id, workspace.id))
				.returning();

			if (!updatedWorkspace) {
				this.throwError("Failed to update workspace task count");
			}

			// Create new task
			const [newTask] = await tx
				.insert(tasksTable)
				.values({
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
					sprintId,
					workspaceId: workspace.id,
					identifier: newTaskIdentifier,
				})
				.returning();

			if (!newTask) {
				this.throwError("There was an issue creating your task");
			}

			// Subscribe user to task (assuming this function is adapted for Drizzle)
			await subscribeUser(author, newTask, tx);

			return newTask;
		});
	}

	async updateTask(args: UpdateTaskParams): Promise<Task> {
		const { updaterId, ...taskData } = args;
		this.logger.info("Updating task with ID: %s", taskData.id);

		return await this.db.transaction(async (tx) => {
			// Find the previous task
			const previousTask = await tx
				.select()
				.from(tasksTable)
				.where(eq(tasksTable.id, taskData.id))
				.limit(1)
				.then((results) => results[0]);

			if (!previousTask) {
				this.throwError("Task not found");
			}

			// Validate effort estimate
			if (taskData.effortEstimate) {
				const effort = Number(taskData.effortEstimate);
				if (
					effort < 0 ||
					Number.isNaN(effort) ||
					!Number.isInteger(effort) ||
					effort > 5
				) {
					this.throwError("Invalid Effort Estimate");
				}
			}

			// Determine if the task is blocking
			const isBlocking = !!(
				taskData.status === "done" ||
				taskData.status === "archived" ||
				taskData.status === "canceled"
			);

			// Prepare update data
			const updateData = {
				...taskData,
				blocking: isBlocking ? [] : undefined,
			};

			// Update the task
			const [updatedTask] = await tx
				.update(tasksTable)
				.set(updateData)
				.where(eq(tasksTable.id, taskData.id))
				.returning();

			if (!updatedTask) {
				this.throwError("There was an issue updating the task");
			}

			// Create log event
			await this.eventService.createLogEvent({
				taskId: updatedTask.id,
				authorId: updaterId,
				changes: taskData,
				previousTask,
			});

			return updatedTask;
		});
	}

	async deleteTask({
		taskId,
	}: { taskId: string }): Promise<{ success: boolean }> {
		this.logger.info("Deleting task by ID: %s", taskId);

		return await this.db.transaction(async (tx) => {
			const result = await tx
				.delete(tasksTable)
				.where(eq(tasksTable.id, taskId))
				.returning();

			if (result.length === 0) {
				this.throwError("There was an issue deleting the task");
			}

			return { success: true };
		});
	}

	async getTask({ taskId }: { taskId: string }): Promise<Task> {
		this.logger.info("Finding task by ID: %s", taskId);

		return await this.db.transaction(async (tx) => {
			const task = await tx
				.select()
				.from(tasksTable)
				.where(eq(tasksTable.id, taskId))
				.limit(1)
				.then((results) => results[0]);

			if (!task) {
				this.throwError("Task Not Found");
			}

			return task;
		});
	}

	async getTaskByIdentifier({
		identifier,
		workspaceId,
	}: {
		identifier: string;
		workspaceId: string;
	}): Promise<Task> {
		return await this.db.transaction(async (tx) => {
			const task = await tx
				.select()
				.from(tasksTable)
				.where(
					and(
						eq(tasksTable.identifier, identifier),
						eq(tasksTable.workspaceId, workspaceId),
					),
				)
				.limit(1)
				.then((results) => results[0]);

			if (!task) {
				this.throwError("Task Not Found");
			}

			return task;
		});
	}

	async getTeamTasks({ teamId }: { teamId: string }): Promise<Task[]> {
		this.logger.info("Getting tasks for team with id: %s", teamId);

		return await this.db.transaction(async (tx) => {
			const tasks = await tx
				.select()
				.from(tasksTable)
				.where(eq(tasksTable.teamId, teamId));

			return tasks;
		});
	}

	async addActiveSprintTasks({
		sprintId,
	}: { sprintId: string }): Promise<number> {
		this.logger.info("Adding active sprints to sprint with id: %s", sprintId);

		return await this.db.transaction(async (tx) => {
			const sprint = await tx
				.select({
					sprint: sprintsTable,
					team: teamsTable,
				})
				.from(sprintsTable)
				.leftJoin(teamsTable, eq(sprintsTable.teamId, teamsTable.id))
				.where(eq(sprintsTable.id, sprintId))
				.limit(1)
				.then((results) => results[0]);

			if (!sprint) {
				this.throwError("Sprint not found");
			}

			if (!sprint.team) {
				this.throwError("Team not found");
			}

			const result = await tx
				.update(tasksTable)
				.set({ sprintId })
				.where(
					and(
						eq(tasksTable.teamId, sprint.team.id),
						isNull(tasksTable.sprintId),
						inArray(tasksTable.status, ["inProgress", "todo", "inReview"]),
					),
				)
				.returning();

			return result.length;
		});
	}

	async addSprintTasks({
		sprintId,
		taskIds,
	}: {
		sprintId: string;
		taskIds: string[];
	}): Promise<number> {
		this.logger.info("Adding tasks to sprint with id %s", sprintId);

		return await this.db.transaction(async (tx) => {
			// First, update all tasks to the sprint
			const updateResult = await tx
				.update(tasksTable)
				.set({ sprintId })
				.where(inArray(tasksTable.id, taskIds))
				.returning();

			// Then, update the status of backlog tasks to todo
			await tx
				.update(tasksTable)
				.set({ status: "todo" })
				.where(
					and(
						inArray(tasksTable.id, taskIds),
						eq(tasksTable.status, "backlog"),
					),
				);

			return updateResult.length;
		});
	}

	async reorderSubtasks(args: {
		parentId: string;
		newOrder: string[];
	}): Promise<Task[]> {
		return await this.db.transaction(async (tx) => {
			// Update the order of tasks
			for (let index = 0; index < args.newOrder.length; index++) {
				await tx
					.update(tasksTable)
					.set({ order: index })
					.where(eq(tasksTable.id, args.newOrder[index]));
			}

			// Fetch and return the reordered subtasks
			const reorderedTasks = await tx
				.select()
				.from(tasksTable)
				.where(eq(tasksTable.parentId, args.parentId))
				.orderBy(asc(tasksTable.order));

			return reorderedTasks;
		});
	}

	async getSubtasks({ parentId }: { parentId: string }): Promise<Task[]> {
		return await this.db.transaction(async (tx) => {
			const subtasks = await tx
				.select()
				.from(tasksTable)
				.where(eq(tasksTable.parentId, parentId))
				.orderBy(asc(tasksTable.order));

			return subtasks;
		});
	}

	async updateBlockedOrBlockingTasks({
		updatingIds,
		taskId,
		key,
	}: {
		updatingIds: string[];
		taskId: string;
		key: "blocking" | "blockedBy";
	}): Promise<Task[]> {
		this.logger.info(`updating task ${key} to`, updatingIds);

		return await this.db.transaction(async (tx) => {
			// Delete existing relationships
			await tx
				.delete(blockedTasksTable)
				.where(
					key === "blocking"
						? eq(blockedTasksTable.a, taskId)
						: eq(blockedTasksTable.b, taskId),
				);

			// Add new relationships
			await tx.insert(blockedTasksTable).values(
				updatingIds.map((id) => ({
					a: key === "blocking" ? taskId : id,
					b: key === "blocking" ? id : taskId,
				})),
			);

			// Fetch and return the updated blocked by tasks
			const blockedByTasks = await tx
				.select()
				.from(tasksTable)
				.innerJoin(blockedTasksTable, eq(blockedTasksTable.a, tasksTable.id))
				.where(eq(blockedTasksTable.b, taskId));

			return blockedByTasks.map(({ Task }) => Task);
		});
	}

	async getTaskBlockedByAndBlocking({ taskId }: { taskId: string }): Promise<{
		blockedBy: Task[];
		blockingIds: string[];
	}> {
		this.logger.info("getting tasks blocking and blocked by task id", taskId);

		return await this.db.transaction(async (tx) => {
			const blockedByTasks = await tx
				.select()
				.from(tasksTable)
				.innerJoin(blockedTasksTable, eq(blockedTasksTable.a, tasksTable.id))
				.where(eq(blockedTasksTable.b, taskId));

			const blockingTasks = await tx
				.select({ id: blockedTasksTable.b })
				.from(blockedTasksTable)
				.where(eq(blockedTasksTable.a, taskId));

			if (blockedByTasks.length === 0 && blockingTasks.length === 0) {
				this.throwError("Task not found");
			}

			return {
				blockedBy: blockedByTasks.map(({ Task }) => Task),
				blockingIds: blockingTasks.map(({ id }) => id),
			};
		});
	}

	async getAllBlockedTaskIds({
		teamId,
	}: { teamId: string }): Promise<string[]> {
		this.logger.info(
			"Getting all blocking taskIds for team with id: %s",
			teamId,
		);

		return await this.db.transaction(async (tx) => {
			const blockedTasks = await tx
				.select({ id: tasksTable.id })
				.from(tasksTable)
				.innerJoin(blockedTasksTable, eq(blockedTasksTable.b, tasksTable.id))
				.where(eq(tasksTable.teamId, teamId))
				.groupBy(tasksTable.id);

			return blockedTasks.map((task) => task.id);
		});
	}

	private throwError(message: string): never {
		this.logger.error(message);
		throw new Error(message);
	}
}
