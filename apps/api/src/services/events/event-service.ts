import type {
	PrismaClient,
	Notification,
	TaskEvent,
	Task,
	NotificationType,
} from "@squared/db";
import type { EventRpc, TaskValue, TaskEventsReturn } from "./types";

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
	}: { userId: string }): Promise<Notification[]> {
		return this.notificationRepository.findMany({ where: { userId } });
	}
	async createLogEvent({
		taskId,
		authorId,
		changes,
	}: {
		taskId: string;
		authorId: string;
		changes: Partial<Task>;
	}): Promise<TaskEvent> {
		const task = await this.taskRepository.findUnique({
			where: { id: taskId },
			include: { Author: true, Workspace: true },
		});

		if (!task) {
			throw new Error(`Task with id ${taskId} not found`);
		}

		const diff = await this.getTaskDiff(taskId, changes);

		const taskEvent = await this.taskEventRepository.create({
			data: {
				taskId,
				authorId,
				message: diff,
			},
		});

		// Generate notification
		if (changes.assigneeId && changes.assigneeId !== task.assigneeId) {
			await this.createNotification({
				userId: changes.assigneeId,
				taskId,
				description: `You have been assigned to task "${task.title}"`,
				type: "ASSIGNED",
			});
		}

		if (changes.status) {
			const statusChangeMessage = `Task "${task.title}" status changed to ${changes.status}`;
			await this.createNotification({
				userId: task.authorId,
				taskId,
				description: statusChangeMessage,
				type: "PARTICIPATING",
			});

			if (task.assigneeId && task.assigneeId !== task.authorId) {
				await this.createNotification({
					userId: task.assigneeId,
					taskId,
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
		type,
	}: {
		userId: string;
		taskId: string;
		description?: string;
		type: NotificationType;
	}): Promise<Notification> {
		return this.notificationRepository.create({
			data: {
				userId,
				taskId,
				description,
				type,
			},
		});
	}

	private async getTaskDiff(
		taskId: string,
		changes: Partial<Task>,
	): Promise<string> {
		const task = await this.taskRepository.findUnique({
			where: { id: taskId },
		});

		if (!task) {
			throw new Error(`Task with id ${taskId} not found`);
		}

		const diff = Object.entries(changes)
			.map(([key, newValue]) => {
				const oldValue = task[key as keyof Task];

				if (oldValue instanceof Date && newValue instanceof Date) {
					if (oldValue.getTime() !== newValue.getTime()) {
						return `${key}: ${oldValue.toISOString()} -> ${newValue.toISOString()}`;
					}
				} else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
					if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
						return `${key}: ${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`;
					}
				} else if (oldValue !== newValue) {
					return `${key}: ${this.formatValue(oldValue)} -> ${this.formatValue(newValue)}`;
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
