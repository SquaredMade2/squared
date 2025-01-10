import type {
	Commit,
	Notification,
	NotificationType,
	PrismaClient,
	Task,
	TaskEvent,
} from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type { EventRpc, FullNotification, TaskValue } from "./types";

export class EventService implements EventRpc {
	private readonly logger: Logger;
	private readonly taskEventRepository: PrismaClient["taskEvent"];
	private readonly commitRepository: PrismaClient["commit"];
	private readonly notificationRepository: PrismaClient["notification"];
	private readonly labelRepository: PrismaClient["label"];
	private readonly userRepository: PrismaClient["user"];

	constructor(db: PrismaClient) {
		this.logger = createCustomLogger("tasks");
		this.taskEventRepository = db.taskEvent;
		this.commitRepository = db.commit;
		this.notificationRepository = db.notification;
		this.labelRepository = db.label;
		this.userRepository = db.user;
	}
	async getTaskEvents({
		taskId,
	}: { taskId: string }): Promise<(TaskEvent | Commit)[]> {
		this.logger.info(
			`Fetching TaskEvents and Commits for Task ID ${taskId}...`,
		);

		const [taskEvents, commits] = await Promise.all([
			this.taskEventRepository.findMany({
				where: { taskId },
				include: { Task: true, Author: true },
				orderBy: { createdAt: "asc" },
			}),
			this.commitRepository.findMany({
				where: { taskId },
				orderBy: { timestamp: "asc" },
			}),
		]);

		this.logger.info(
			`Successfully fetched ${taskEvents.length} TaskEvents and ${commits.length} Commits for Task ID ${taskId}.`,
		);

		return [...taskEvents, ...commits];
	}
	async getNotifications({
		userId,
	}: { userId: string }): Promise<FullNotification[]> {
		return this.notificationRepository.findMany({
			where: { userId },
			include: { Task: true, Workspace: true },
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

		const taskEvent = await this.taskEventRepository.create({
			data: {
				taskId,
				authorId,
				message: diff,
			},
		});

		// Generate notification
		if (changes.assigneeId && changes.assigneeId !== previousTask.assigneeId) {
			await this.createNotification({
				userId: changes.assigneeId,
				taskId,
				workspaceId: previousTask.workspaceId,
				description: `You have been assigned to task "${previousTask.title}"`,
				type: "ASSIGNED",
			});
		}

		if (changes.status) {
			const statusChangeMessage = `Task "${previousTask.title}" status changed to ${changes.status}`;
			await this.createNotification({
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
				await this.createNotification({
					userId: previousTask.assigneeId,
					taskId,
					workspaceId: previousTask.workspaceId,
					description: statusChangeMessage,
					type: "PARTICIPATING",
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
		return this.notificationRepository.create({
			data: {
				userId,
				taskId,
				description,
				workspaceId,
				type,
			},
		});
	}
	async toggleNotification({
		notificationIds,
		read,
		dismissed,
	}: {
		notificationIds: string[];
		read?: boolean;
		dismissed?: boolean;
	}): Promise<Notification[]> {
		// First, update the notifications
		await this.notificationRepository.updateMany({
			where: { id: { in: notificationIds } },
			data: { read, dismissed },
		});

		// Then, fetch and return the updated notifications
		const updatedNotifications = await this.notificationRepository.findMany({
			where: { id: { in: notificationIds } },
		});

		return updatedNotifications;
	}
	async deleteNotification({
		notificationIds,
	}: { notificationIds: string[] }): Promise<void> {
		await this.notificationRepository.deleteMany({
			where: { id: { in: notificationIds } },
		});
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
					const diffString =
						key === "title" || key === "description" || key === "labels"
							? `${key} has been updated`
							: `${key} changed from ${formattedOldValue} to ${formattedNewValue}`;
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

		// Handle assigneeId
		if (key === "assigneeId" && typeof value === "string") {
			const user = await this.userRepository.findUnique({
				where: { id: value },
				select: { name: true },
			});
			return user?.name ?? "Unknown User";
		}

		// Handle labels array
		if (Array.isArray(value) && key === "labels") {
			const labelIds = value as string[];
			if (labelIds.length === 0) {
				return "No labels";
			}
			const labels = await this.labelRepository.findMany({
				where: { id: { in: labelIds } },
				select: { name: true },
			});
			return labels.map((l) => l.name).join(", ");
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
				oldValue: this.parseValue(oldValue),
				newValue: this.parseValue(newValue),
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
