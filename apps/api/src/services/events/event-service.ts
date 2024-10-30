import type { PrismaClient, Notification, TaskEvent, Task } from "@squared/db";
import type { EventRpc, Event } from "./types";

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
	async getTaskEvents({ taskId }: { taskId: string }): Promise<Event[]> {
		const [taskEvents, commits] = await Promise.all([
			this.taskEventRepository.findMany({ where: { taskId } }),
			this.commitRepository.findMany({ where: { taskId } }),
		]);
		return [...taskEvents, ...commits].sort((a, b) => {
			const aTime =
				"createdAt" in a ? a.createdAt.getTime() : a.timestamp.getTime();
			const bTime =
				"createdAt" in b ? b.createdAt.getTime() : b.timestamp.getTime();
			return aTime - bTime;
		});
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
		changes: Partial<TaskEvent>;
	}): Promise<TaskEvent> {
		return this.taskEventRepository.create({
			data: {
				taskId,
				authorId,
				message,
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

				// Handle different types of values
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
}
