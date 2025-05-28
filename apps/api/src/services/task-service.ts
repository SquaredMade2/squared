import { client } from "@/utils/client";
import { baseProcedure, j } from "@/utils/sqStack";
import { subscribeUser } from "@/utils/taskUpdate";
import {
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
} from "@squaredmade/db";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";
import { labelSchema, priorityEnum, statusEnum } from "./schema";

export const taskService = j.router({
	createTask: baseProcedure
		.input(
			z.object({
				authorId: z.string(),
				title: z.string(),
				description: z.string().optional(),
				dueDate: z.date().optional(),
				effortEstimate: z.number().optional(),
				teamId: z.string(),
				status: statusEnum.optional(),
				priority: priorityEnum.optional(),
				labels: z.array(labelSchema).optional(),
				parentId: z.string().optional(),
				sprintId: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const {
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
			} = input;
			const { db, logger } = ctx;

			logger.info("Creating task by payload", {
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

			const result = await db.transaction(async (tx) => {
				// Find team and associated workspace
				const teamWithWorkspace = await tx
					.select({
						team: teamsTable,
						workspace: workspacesTable,
					})
					.from(teamsTable)
					.leftJoin(
						workspacesTable,
						eq(teamsTable.workspaceId, workspacesTable.externalId),
					)
					.where(eq(teamsTable.id, teamId))
					.limit(1)
					.then((results) => results[0]);

				if (!teamWithWorkspace) {
					throw new HTTPException(404, { message: "Team not found" });
				}

				const { team, workspace } = teamWithWorkspace;

				if (!workspace) {
					throw new HTTPException(404, { message: "Workspace not found" });
				}

				// Find author
				const author = await tx
					.select()
					.from(usersTable)
					.where(eq(usersTable.externalId, authorId))
					.limit(1)
					.then((results) => results[0]);

				if (!author) {
					throw new HTTPException(404, { message: "Author not found" });
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
						throw new HTTPException(400, {
							message: "Invalid Effort Estimate supplied",
						});
					}
				}

				// Get highest task number for the team
				const highestTaskNumber = await tx
					.select({
						maxNumber: max(
							sql`CAST(SPLIT_PART(${tasksTable.identifier}, '-', 2) AS INTEGER)`,
						),
					})
					.from(tasksTable)
					.where(eq(tasksTable.teamId, teamId))
					.then((result) => result[0]?.maxNumber || 0);

				// Generate new task identifier
				const newTaskNumber = Number(highestTaskNumber) + 1;
				const newTaskIdentifier = `${team.identifier}-${newTaskNumber.toString()}`;

				// Update workspace task count
				const [{ workspaceUrl }] = await tx
					.update(workspacesTable)
					.set({ tasksCreated: sql`${workspacesTable.tasksCreated} + 1` })
					.where(eq(workspacesTable.externalId, workspace.externalId))
					.returning({ workspaceUrl: workspacesTable.url });

				if (!workspaceUrl) {
					throw new HTTPException(500, {
						message: "Failed to update workspace task count",
					});
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
						workspaceId: workspace.externalId,
						identifier: newTaskIdentifier,
					})
					.returning();

				if (!newTask) {
					throw new HTTPException(500, {
						message: "There was an issue creating your task",
					});
				}

				await subscribeUser(author, newTask, tx);

				return {
					task: newTask,
					url: `/${workspaceUrl}/task/${newTaskIdentifier}/${newTask.title.split(" ").join("-")}`,
				};
			});

			return c.superjson(result);
		}),

	updateTask: baseProcedure
		.input(
			z.object({
				id: z.string(),
				updaterId: z.string(),
				title: z.string().optional(),
				description: z.string().optional(),
				dueDate: z.date().optional(),
				effortEstimate: z.number().optional(),
				status: statusEnum.optional(),
				priority: priorityEnum.optional(),
				labels: z.array(labelSchema).optional(),
				parentId: z.string().optional(),
				sprintId: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { updaterId, ...taskData } = input;
			const { db, logger } = ctx;
			logger.info("Updating task with ID", taskData.id);

			const updatedTask = await db.transaction(async (tx) => {
				// Find the previous task
				const previousTask = await tx
					.select()
					.from(tasksTable)
					.where(eq(tasksTable.id, taskData.id))
					.limit(1)
					.then((results) => results[0]);

				if (!previousTask) {
					throw new HTTPException(404, { message: "Task not found" });
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
						throw new HTTPException(400, {
							message: "Invalid Effort Estimate",
						});
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
					.set({ ...updateData, updatedAt: new Date() })
					.where(eq(tasksTable.id, taskData.id))
					.returning();

				if (!updatedTask) {
					throw new HTTPException(500, {
						message: "There was an issue updating the task",
					});
				}

				// Create log event
				await client.event.createLogEvent.$post({
					taskId: updatedTask.id,
					authorId: updaterId,
					changes: taskData,
					previousTask,
				});

				return updatedTask;
			});

			return c.superjson(updatedTask);
		}),

	deleteTask: baseProcedure
		.input(z.object({ taskId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { taskId } = input;
			const { db, logger } = ctx;
			logger.info("Deleting task by ID", taskId);

			const result = await db.transaction(async (tx) => {
				const deleteResult = await tx
					.delete(tasksTable)
					.where(eq(tasksTable.id, taskId))
					.returning();

				if (deleteResult.length === 0) {
					throw new HTTPException(500, {
						message: "There was an issue deleting the task",
					});
				}

				return { success: true };
			});

			return c.superjson(result);
		}),

	getTask: baseProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { taskId } = input;
			const { db, logger } = ctx;
			logger.info("Finding task by ID", taskId);

			const task = await db.transaction(async (tx) => {
				const task = await tx
					.select()
					.from(tasksTable)
					.where(eq(tasksTable.id, taskId))
					.limit(1)
					.then((results) => results[0]);

				if (!task) {
					throw new HTTPException(404, { message: "Task Not Found" });
				}

				return task;
			});

			return c.superjson(task);
		}),

	getTaskByIdentifier: baseProcedure
		.input(
			z.object({
				identifier: z.string(),
				workspaceId: z.string(),
			}),
		)
		.query(async ({ input, ctx, c }) => {
			const { identifier, workspaceId } = input;
			const { db } = ctx;

			const task = await db.transaction(async (tx) => {
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
					throw new HTTPException(404, { message: "Task Not Found" });
				}

				return task;
			});

			return c.superjson(task);
		}),

	getTeamTasks: baseProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { teamId } = input;
			const { db, logger } = ctx;
			logger.info("Getting tasks for team with id", teamId);

			const tasks = await db.transaction(async (tx) => {
				const tasks = await tx
					.select()
					.from(tasksTable)
					.where(eq(tasksTable.teamId, teamId));

				return tasks;
			});

			return c.superjson(tasks);
		}),

	addActiveSprintTasks: baseProcedure
		.input(z.object({ sprintId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { sprintId } = input;
			const { db, logger } = ctx;
			logger.info("Adding active sprints to sprint with id", sprintId);

			const count = await db.transaction(async (tx) => {
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
					throw new HTTPException(404, { message: "Sprint not found" });
				}

				if (!sprint.team) {
					throw new HTTPException(404, { message: "Team not found" });
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

			return c.superjson(count);
		}),

	addSprintTasks: baseProcedure
		.input(
			z.object({
				sprintId: z.string(),
				taskIds: z.array(z.string()),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { sprintId, taskIds } = input;
			const { db, logger } = ctx;
			logger.info("Adding tasks to sprint with id %s", sprintId);

			const updatedTasks = await db.transaction(async (tx) => {
				// First, update the status of backlog tasks to todo
				await tx
					.update(tasksTable)
					.set({ status: "todo" })
					.where(
						and(
							inArray(tasksTable.id, taskIds),
							eq(tasksTable.status, "backlog"),
						),
					);

				// Then, return the updated Tasks
				const updateResult = await tx
					.update(tasksTable)
					.set({ sprintId })
					.where(inArray(tasksTable.id, taskIds))
					.returning();

				return updateResult;
			});

			return c.superjson(updatedTasks);
		}),

	reorderSubtasks: baseProcedure
		.input(
			z.object({
				parentId: z.string(),
				newOrder: z.array(z.string()),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { parentId, newOrder } = input;
			const { db } = ctx;

			const reorderedTasks = await db.transaction(async (tx) => {
				// Update the order of tasks
				for (let index = 0; index < newOrder.length; index++) {
					await tx
						.update(tasksTable)
						.set({ order: index })
						.where(eq(tasksTable.id, newOrder[index]));
				}

				const teamId = await tx
					.select({ teamId: tasksTable.teamId })
					.from(tasksTable)
					.where(eq(tasksTable.id, parentId))
					.then((result) => result[0].teamId);

				// Fetch and return the reordered subtasks
				const reorderedTasks = await tx
					.select()
					.from(tasksTable)
					.where(eq(tasksTable.teamId, teamId))
					.orderBy(asc(tasksTable.order));

				return reorderedTasks;
			});

			return c.superjson(reorderedTasks);
		}),

	getSubtasks: baseProcedure
		.input(z.object({ parentId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { parentId } = input;
			const { db } = ctx;

			const subtasks = await db.transaction(async (tx) => {
				const subtasks = await tx
					.select()
					.from(tasksTable)
					.where(eq(tasksTable.parentId, parentId))
					.orderBy(asc(tasksTable.order));

				return subtasks;
			});

			return c.superjson(subtasks);
		}),

	updateBlockedOrBlockingTasks: baseProcedure
		.input(
			z.object({
				updatingIds: z.array(z.string()),
				taskId: z.string(),
				key: z.enum(["blocking", "blockedBy"]),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { updatingIds, taskId, key } = input;
			const { db, logger } = ctx;
			logger.info(`updating task ${key} to`, updatingIds);

			const updatedTasks = await db.transaction(async (tx) => {
				// Delete existing relationships
				await tx
					.delete(blockedTasksTable)
					.where(
						key === "blocking"
							? eq(blockedTasksTable.a, taskId)
							: eq(blockedTasksTable.b, taskId),
					);

				// Add new relationships
				if (updatingIds.length > 0) {
					await tx.insert(blockedTasksTable).values(
						updatingIds.map((id) => ({
							a: key === "blocking" ? taskId : id,
							b: key === "blocking" ? id : taskId,
						})),
					);
				}

				// Fetch and return the updated blocked by tasks
				const blockedByTasks = await tx
					.select()
					.from(tasksTable)
					.innerJoin(blockedTasksTable, eq(blockedTasksTable.a, tasksTable.id))
					.where(eq(blockedTasksTable.b, taskId));

				return blockedByTasks.map(({ Task }) => Task);
			});

			return c.superjson(updatedTasks);
		}),

	getTaskBlockedByAndBlocking: baseProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { taskId } = input;
			const { db, logger } = ctx;
			logger.info("getting tasks blocking and blocked by task id", taskId);

			const result = await db.transaction(async (tx) => {
				const blockedByTasksQuery = tx
					.select()
					.from(tasksTable)
					.innerJoin(blockedTasksTable, eq(blockedTasksTable.a, tasksTable.id))
					.where(eq(blockedTasksTable.b, taskId));

				const blockingTasksQuery = tx
					.select({ id: blockedTasksTable.b })
					.from(blockedTasksTable)
					.where(eq(blockedTasksTable.a, taskId));

				const taskQuery = tx
					.select({ id: tasksTable.id })
					.from(tasksTable)
					.where(eq(tasksTable.id, taskId));

				const [blockedByTasks, blockingTasks, task] = await Promise.all([
					blockedByTasksQuery,
					blockingTasksQuery,
					taskQuery,
				]);

				if (!task || task.length === 0) {
					throw new HTTPException(404, { message: "Task not found" });
				}

				return {
					blockedBy: blockedByTasks.map(({ Task }) => Task),
					blockingIds: blockingTasks.map(({ id }) => id),
				};
			});

			return c.superjson(result);
		}),

	getAllBlockedTaskIds: baseProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { teamId } = input;
			const { db, logger } = ctx;
			logger.info("Getting all blocking taskIds for team with id", teamId);

			const blockedTaskIds = await db.transaction(async (tx) => {
				const blockedTasks = await tx
					.select({ id: tasksTable.id })
					.from(tasksTable)
					.innerJoin(blockedTasksTable, eq(blockedTasksTable.b, tasksTable.id))
					.where(eq(tasksTable.teamId, teamId))
					.groupBy(tasksTable.id);

				return blockedTasks.map((task) => task.id);
			});

			return c.superjson(blockedTaskIds);
		}),
});
