import { baseProcedure, j } from "@/middleware";
import {
	type DBClient,
	type Task,
	and,
	asc,
	desc,
	eq,
	githubCommitsTable,
	githubPullRequestTaskTable,
	githubPullRequestsTable,
	inArray,
	notificationsTable,
	sprintsTable,
	taskEventsTable,
	tasksTable,
	usersTable,
	workspacesTable,
} from "@squaredmade/db";
import z from "zod/v4";
import { taskSchema } from "./schema";

export const eventService = j.router({
	getTaskEvents: baseProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const { taskId } = input;
			logger.info("Getting task events for task with id", input.taskId);
			const [taskEvents, commits] = await Promise.all([
				db
					.select()
					.from(taskEventsTable)
					.where(eq(taskEventsTable.taskId, taskId))
					.orderBy(asc(taskEventsTable.createdAt)),
				db
					.select({
						id: githubCommitsTable.id,
						externalId: githubCommitsTable.externalId,
						message: githubCommitsTable.message,
						url: githubCommitsTable.url,
						author: githubCommitsTable.author,
						timestamp: githubCommitsTable.timestamp,
						repoId: githubCommitsTable.repoId,
						pullId: githubPullRequestsTable.externalId,
					})
					.from(githubCommitsTable)
					.innerJoin(
						githubPullRequestsTable,
						eq(githubCommitsTable.pullId, githubPullRequestsTable.externalId),
					)
					.innerJoin(
						githubPullRequestTaskTable,
						and(
							eq(
								githubPullRequestsTable.externalId,
								githubPullRequestTaskTable.pullRequestId,
							),
							eq(githubPullRequestTaskTable.taskId, taskId),
						),
					)
					.orderBy(desc(githubCommitsTable.timestamp)),
			]);

			logger.info(
				`Successfully fetched ${taskEvents.length} TaskEvents and ${commits.length} Commits for Task ID ${taskId}.`,
			);

			return c.superjson([...taskEvents, ...commits]);
		}),
	getNotifications: baseProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const { userId } = input;
			logger.info("Getting notifications for user with id", input.userId);
			const notifications = await db
				.select({
					notification: notificationsTable,
					task: tasksTable,
					workspace: workspacesTable,
				})
				.from(notificationsTable)
				.leftJoin(tasksTable, eq(notificationsTable.taskId, tasksTable.id))
				.leftJoin(
					workspacesTable,
					eq(notificationsTable.workspaceId, workspacesTable.externalId),
				)
				.where(eq(notificationsTable.userId, userId));

			const fullNotifications = notifications.map((noti) => {
				const { notification, task, workspace } = noti;
				if (!task || !workspace) throw new Error("Task or Workspace not found");
				return {
					...notification,
					Task: task,
					Workspace: workspace,
				};
			});

			return c.superjson(fullNotifications);
		}),
	createLogEvent: baseProcedure
		.input(
			z.object({
				taskId: z.string(),
				authorId: z.string(),
				changes: taskSchema.partial(),
				previousTask: taskSchema,
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const { taskId, authorId, changes, previousTask } = input;
			logger.info("Creating log event for task with id", input.taskId);

			const diff = await getTaskDiff(db, previousTask, changes);

			if (diff === "No changes") {
				logger.info(
					`No changes detected for Task ${taskId}. No TaskEvent created.`,
				);
				return c.status(204);
			}

			const [taskEvent] = await db
				.insert(taskEventsTable)
				.values({
					taskId,
					authorId,
					message: diff,
				})
				.returning();

			if (
				changes.assigneeId &&
				changes.assigneeId !== previousTask.assigneeId
			) {
				// Generate notification
				await db.insert(notificationsTable).values({
					userId: changes.assigneeId,
					taskId,
					workspaceId: previousTask.workspaceId,
					description: `You have been assigned to task "${previousTask.title}"`,
					type: "ASSIGNED",
				});
			}

			if (changes.status) {
				const statusChangeMessage = `Task "${previousTask.title}" status changed to ${changes.status}`;
				await db.insert(notificationsTable).values({
					userId: previousTask.authorId,
					taskId,
					workspaceId: previousTask.workspaceId,
					description: statusChangeMessage,
					type: "PARTICIPATING",
				});

				if (
					previousTask.assigneeId &&
					previousTask.assigneeId !== previousTask.authorId
				) {
					await db.insert(notificationsTable).values({
						userId: previousTask.assigneeId,
						taskId,
						workspaceId: previousTask.workspaceId,
						description: statusChangeMessage,
						type: "PARTICIPATING",
					});
				}
			}

			return c.superjson(taskEvent, 201);
		}),
	createNotification: baseProcedure
		.input(
			z.object({
				userId: z.string(),
				taskId: z.string(),
				workspaceId: z.string(),
				description: z.string(),
				type: z.enum(["ASSIGNED", "PARTICIPATING", "MENTIONED", "CREATED"]),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const { userId, taskId, workspaceId, description, type } = input;
			logger.info("Creating notification for user with id", input.userId);
			const [notification] = await db
				.insert(notificationsTable)
				.values({
					userId,
					taskId,
					workspaceId,
					description,
					type,
				})
				.returning();
			return c.superjson(notification, 201);
		}),
	toggleNotification: baseProcedure
		.input(
			z.object({
				notificationIds: z.array(z.string()),
				read: z.boolean().optional(),
				dismissed: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const { notificationIds, read, dismissed } = input;
			logger.info("Toggling notifications with ids", input.notificationIds);
			return c.superjson(
				await db.transaction(async (tx) => {
					// Update the notifications
					await tx
						.update(notificationsTable)
						.set({ read, dismissed })
						.where(inArray(notificationsTable.id, notificationIds));

					// Fetch and return the updated notifications
					const notifications = await tx
						.select({
							notification: notificationsTable,
							task: tasksTable,
							workspace: workspacesTable,
						})
						.from(notificationsTable)
						.leftJoin(tasksTable, eq(notificationsTable.taskId, tasksTable.id))
						.leftJoin(
							workspacesTable,
							eq(notificationsTable.workspaceId, workspacesTable.externalId),
						)
						.where(inArray(notificationsTable.id, notificationIds));

					return notifications.map((noti) => {
						const { notification, task, workspace } = noti;
						if (!task || !workspace)
							throw new Error("Task or Workspace not found");
						return {
							...notification,
							Task: task,
							Workspace: workspace,
						};
					});
				}),
			);
		}),
	deleteNotification: baseProcedure
		.input(z.object({ notificationIds: z.array(z.string()) }))
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const { notificationIds } = input;
			logger.info("Deleting notifications with ids", input.notificationIds);
			await db
				.delete(notificationsTable)
				.where(inArray(notificationsTable.id, notificationIds));
			return c.status(204);
		}),
});

const getTaskDiff = async (
	db: DBClient,
	previousTask: Task,
	changes: Partial<Task>,
): Promise<string> => {
	const diff = await Promise.all(
		Object.entries(changes).map(async ([key, newValue]) => {
			if (key === "id" || key === "updatedAt") return null;
			if (newValue === undefined) return null;

			const oldValue = previousTask[key as keyof Task];
			const [formattedOldValue, formattedNewValue] = await Promise.all([
				formatValue(db, oldValue, key),
				formatValue(db, newValue, key),
			]);

			if (formattedOldValue !== formattedNewValue) {
				const formattedKey = `${key[0].toUpperCase()}${key.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")}`;
				if (formattedKey === "Parent Id" && changes.parentId) {
					if (previousTask.parentId) {
						const parentIds = [previousTask.parentId, changes.parentId];
						const parentTitles = await db
							.select({ title: tasksTable.title })
							.from(tasksTable)
							.where(inArray(tasksTable.id, parentIds));
						return `Parent Task changed from ${parentTitles[0].title} to ${parentTitles[1].title}`;
					}
					const parentId = changes.parentId;
					const parentTitle = await db
						.select({ title: tasksTable.title })
						.from(tasksTable)
						.where(eq(tasksTable.id, parentId))
						.limit(1);
					return `Parent Task changed to ${parentTitle[0].title}`;
				}
				const diffString =
					formattedKey === "Title" ||
					formattedKey === "Description" ||
					formattedKey === "Labels"
						? // Note update labels to show difference after Drizzle update
							`Updated the ${key}`
						: `${formattedKey} changed from ${formattedOldValue} to ${formattedNewValue}`;
				return diffString;
			}
			return null;
		}),
	);

	const filteredDiff = diff.filter(Boolean).join(", ");

	if (filteredDiff.length > 0) {
		return filteredDiff;
	}

	return "No changes";
};

const formatValue = async (
	db: DBClient,
	value: Task[keyof Task],
	key: string,
): Promise<string> => {
	if (value === null || value === undefined) {
		switch (key) {
			case "labels":
				return "No labels";
			case "effortEstimate":
				return "No estimate";
			case "assigneeId":
				return "Unassigned";
			default:
				return "None";
		}
	}

	// Handle parentId
	if (key === "parentId" && typeof value === "string") {
		const [task] = await db
			.select({ identifier: tasksTable.identifier })
			.from(tasksTable)
			.where(eq(tasksTable.id, value))
			.limit(1);
		return task?.identifier ?? "Unknown Task";
	}

	// Handle due date
	if (
		key === "dueDate" &&
		(typeof value === "string" || value instanceof Date)
	) {
		const formattedDate = new Date(value).toLocaleDateString("en-us", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
		return formattedDate;
	}

	// Handle status and priority
	if ((key === "status" || key === "priority") && typeof value === "string") {
		if (value === "todo") {
			return "To Do";
		}
		return `${value[0].toUpperCase()}${value.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")}`;
	}

	// Handle sprintId
	if (key === "sprintId" && typeof value === "string") {
		const sprint = await db
			.select({ name: sprintsTable.name })
			.from(sprintsTable)
			.where(eq(sprintsTable.id, value))
			.limit(1);

		return sprint[0]?.name ?? "Unknown Sprint";
	}

	if (key === "assigneeId" && typeof value === "string") {
		// Handle assigneeId
		const [user] = await db
			.select({ name: usersTable.name })
			.from(usersTable)
			.where(eq(usersTable.externalId, value))
			.limit(1);

		return user?.name ?? "Unknown User";
	}

	// Handle labels array
	if (Array.isArray(value) && key === "labels") {
		return value.map((l) => l.name).join(", ");
	}

	// Handle effort estimate
	if (key === "effortEstimate") {
		return String(value);
	}
	if (value instanceof Date) {
		return value.toISOString();
	}
	return String(value);
};
