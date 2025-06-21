import {
	and,
	asc,
	type DBClient,
	desc,
	eq,
	type GithubCommit,
	githubCommitsTable,
	githubPullRequestsTable,
	githubPullRequestTaskTable,
	inArray,
	type Notification,
	type NotificationType,
	notificationsTable,
	sprintsTable,
	type Task,
	type TaskEvent,
	taskEventsTable,
	tasksTable,
	usersTable,
	workspacesTable,
} from "@squaredmade/db";
import type { Logger } from "@squaredmade/logger";
import createCustomLogger from "@squaredmade/logger";
import type { EventRpc, FullNotification, TaskValue } from "./types";

export class EventService implements EventRpc {
	private readonly logger: Logger;
	private readonly db: DBClient;

	constructor(db: DBClient) {
		this.logger = createCustomLogger("events");
		this.db = db;
	}
	async getTaskEvents({
		taskId,
	}: {
		taskId: string;
	}): Promise<(TaskEvent | GithubCommit)[]> {
		this.logger.info(
			`Fetching TaskEvents and Commits for Task ID ${taskId}...`,
		);

		const [taskEvents, commits] = await Promise.all([
			this.db
				.select()
				.from(taskEventsTable)
				.where(eq(taskEventsTable.taskId, taskId))
				.orderBy(asc(taskEventsTable.createdAt)),
			this.db
				.select({
					author: githubCommitsTable.author,
					externalId: githubCommitsTable.externalId,
					id: githubCommitsTable.id,
					message: githubCommitsTable.message,
					pullId: githubPullRequestsTable.externalId,
					repoId: githubCommitsTable.repoId,
					timestamp: githubCommitsTable.timestamp,
					url: githubCommitsTable.url,
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

		this.logger.info(
			`Successfully fetched ${taskEvents.length} TaskEvents and ${commits.length} Commits for Task ID ${taskId}.`,
		);

		return [...taskEvents, ...commits];
	}
	async getNotifications({
		userId,
	}: {
		userId: string;
	}): Promise<FullNotification[]> {
		this.logger.info("Fetching Notifications for userId: ", userId);
		const notifications = await this.db
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

		return notifications.map((noti) => {
			const { notification, task, workspace } = noti;
			if (!(task && workspace)) throw new Error("Task or Workspace not found");
			return {
				...notification,
				task,
				workspace,
			};
		});
	}
	async createLogEvent({
		taskId,
		authorId,
		changes,
		previousTask,
	}: {
		taskId: string;
		authorId: string;
		changes: Partial<Task>;
		previousTask: Task;
	}): Promise<TaskEvent | null> {
		this.logger.info(`Checking for changes on Task ${taskId}`);

		const diff = await this.getTaskDiff(previousTask, changes);

		if (diff === "No changes") {
			this.logger.info(
				`No changes detected for Task ${taskId}. No TaskEvent created.`,
			);
			return null;
		}

		const [taskEvent] = await this.db
			.insert(taskEventsTable)
			.values({
				authorId,
				message: diff,
				taskId,
			})
			.returning();

		// Generate notification
		if (changes.assigneeId && changes.assigneeId !== previousTask.assigneeId) {
			await this.createNotification({
				description: `You have been assigned to task "${previousTask.title}"`,
				taskId,
				type: "ASSIGNED",
				userId: changes.assigneeId,
				workspaceId: previousTask.workspaceId,
			});
		}

		if (changes.status) {
			const statusChangeMessage = `Task "${previousTask.title}" status changed to ${changes.status}`;
			await this.createNotification({
				description: statusChangeMessage,
				taskId,
				type: "PARTICIPATING",
				userId: previousTask.authorId,
				workspaceId: previousTask.workspaceId,
			});

			if (
				previousTask.assigneeId &&
				previousTask.assigneeId !== previousTask.authorId
			) {
				await this.createNotification({
					description: statusChangeMessage,
					taskId,
					type: "PARTICIPATING",
					userId: previousTask.assigneeId,
					workspaceId: previousTask.workspaceId,
				});
			}
		}

		return taskEvent;
	}
	async createNotification({
		userId,
		taskId,
		description,
		workspaceId,
		type,
	}: {
		userId: string;
		taskId: string;
		workspaceId: string;
		description?: string;
		type: NotificationType;
	}): Promise<Notification> {
		this.logger.info(
			`Creating notification for userId: ${userId}, taskId: ${taskId}, type: ${type}`,
		);
		return await this.db
			.insert(notificationsTable)
			.values({
				description,
				taskId,
				type,
				userId,
				workspaceId,
			})
			.returning()
			.then((res) => res[0]);
	}
	async toggleNotification({
		notificationIds,
		read,
		dismissed,
	}: {
		notificationIds: string[];
		read?: boolean;
		dismissed?: boolean;
	}): Promise<FullNotification[]> {
		return await this.db.transaction(async (tx) => {
			// Update the notifications
			await tx
				.update(notificationsTable)
				.set({ dismissed, read })
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
				if (!(task && workspace))
					throw new Error("Task or Workspace not found");
				return {
					...notification,
					task,
					workspace,
				};
			});
		});
	}
	async deleteNotification({
		notificationIds,
	}: {
		notificationIds: string[];
	}): Promise<void> {
		await this.db
			.delete(notificationsTable)
			.where(inArray(notificationsTable.id, notificationIds));
	}
	private async getTaskDiff(
		previousTask: Task,
		changes: Partial<Task>,
	): Promise<string> {
		const diff = await Promise.all(
			Object.entries(changes).map(async ([key, newValue]) => {
				if (key === "id" || key === "updatedAt") return null;
				if (newValue === undefined) return null;

				const oldValue = previousTask[key as keyof Task];
				const [formattedOldValue, formattedNewValue] = await Promise.all([
					this.formatValue(oldValue, key),
					this.formatValue(newValue, key),
				]);

				if (formattedOldValue !== formattedNewValue) {
					const formattedKey = `${key[0].toUpperCase()}${key.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")}`;
					if (formattedKey === "Parent Id" && changes.parentId) {
						if (previousTask.parentId) {
							const parentIds = [previousTask.parentId, changes.parentId];
							const parentTitles = await this.db
								.select({ title: tasksTable.title })
								.from(tasksTable)
								.where(inArray(tasksTable.id, parentIds));
							return `Parent Task changed from ${parentTitles[0].title} to ${parentTitles[1].title}`;
						}
						const parentId = changes.parentId;
						const parentTitle = await this.db
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
	}
	private async formatValue(
		value: Task[keyof Task],
		key: string,
	): Promise<string> {
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
			const [task] = await this.db
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
				day: "numeric",
				month: "short",
				year: "numeric",
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
			const sprint = await this.db
				.select({ name: sprintsTable.name })
				.from(sprintsTable)
				.where(eq(sprintsTable.id, value))
				.limit(1);

			return sprint[0]?.name ?? "Unknown Sprint";
		}

		if (key === "assigneeId" && typeof value === "string") {
			// Handle assigneeId
			const [user] = await this.db
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
	}

	private deserializeLogEvent(taskEvent: TaskEvent): {
		[key: string]: { oldValue: TaskValue; newValue: TaskValue };
	} {
		const changes: {
			[key: string]: { oldValue: TaskValue; newValue: TaskValue };
		} = {};
		const changePairs = taskEvent.message.split(", ");

		for (const pair of changePairs) {
			const [key, values] = pair.split(": ");
			const [oldValue, newValue] = values.split(" -> ");
			changes[key] = {
				newValue: this.parseValue(newValue),
				oldValue: this.parseValue(oldValue),
			};
		}

		return changes;
	}
	private parseValue(value: string): TaskValue {
		if (value === "null") {
			return null;
		}
		if (value.startsWith('"') && value.endsWith('"')) {
			return value.slice(1, -1);
		}
		if (value.startsWith("[") && value.endsWith("]")) {
			return JSON.parse(value);
		}
		if (!Number.isNaN(Date.parse(value))) {
			return new Date(value);
		}
		return value;
	}
}
