import type {
	Notification,
	NotificationType,
	PrismaClient,
	Task,
	TaskEvent,
} from "@squared/db";
import type {
	EventRpc,
	FullNotification,
	TaskEventsReturn,
	TaskValue,
} from "./types";

export class EventService implements EventRpc {
	private taskEventRepository: PrismaClient["taskEvent"];
	private commitRepository: PrismaClient["commit"];
	private notificationRepository: PrismaClient["notification"];
	private taskRepository: PrismaClient["task"];

	constructor(db: PrismaClient) {
		this.taskEventRepository = db.taskEvent;
		this.commitRepository = db.commit;
		this.notificationRepository = db.notification;
		this.taskRepository = db.task;
	}
	async getTaskEvents({ taskId }: { taskId: string }): TaskEventsReturn {
		const [taskEvents, commits] = await Promise.all([
			this.taskEventRepository.findMany({ where: { taskId } }),
			this.commitRepository.findMany({ where: { taskId } }),
		]);
		return [...taskEvents, ...commits]
			.sort((a, b) => {
				const aTime =
					"createdAt" in a ? a.createdAt.getTime() : a.timestamp.getTime();
				const bTime =
					"createdAt" in b ? b.createdAt.getTime() : b.timestamp.getTime();
				return aTime - bTime;
			})
			.map((e) => ("createdAt" in e ? this.deserializeLogEvent(e) : e));
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
	}): Promise<TaskEvent> {
		const diff = this.getTaskDiff(previousTask, changes);

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

			if (previousTask.assigneeId && previousTask.assigneeId !== previousTask.authorId) {
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
	private getTaskDiff(
		previousTask: Task,
		changes: Partial<Task>,
	): string {
		const diff = Object.entries(changes)
			.map(([key, newValue]) => {
				if (key === 'id' || key === 'updatedAt') return null;
				if (newValue === undefined) return null;
				
				const oldValue = previousTask[key as keyof Task];
				const formattedOldValue = this.formatValue(oldValue);
				const formattedNewValue = this.formatValue(newValue);

				if (formattedOldValue !== formattedNewValue) {
					const diffString = `${key} changed from ${formattedOldValue} to ${formattedNewValue}`;
					return diffString;
				}
				return null;
			})
			.filter(Boolean)
			.join(", ");

		return diff.length > 0 ? diff : "No changes";
	}
	private formatValue(value: Task[keyof Task]): string {
		if (value === null || value === undefined) {
			return "null";
		}
		if (typeof value === "string") {
			return `"${value}"`;
		}
		if (value instanceof Date) {
			return value.toISOString();
		}
		if (Array.isArray(value)) {
			// Special handling for labels array
			if (value.length > 0 && typeof value[0] === 'string' && value[0].match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
				return JSON.stringify(value.map(id => {
					return `Label ${id.substring(0, 8)}`;
				}));
			}
			return JSON.stringify(value);
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
