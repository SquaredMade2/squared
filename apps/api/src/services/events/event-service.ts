import type { PrismaClient, Notification, TaskEvent } from "@squared/db";
import type { EventRpc, Event } from "./types";

export class EventService implements EventRpc {
	private taskEventRepository: PrismaClient["taskEvent"];
	private commitRepository: PrismaClient["commit"];
	private notificationRepository: PrismaClient["notification"];

	constructor(db: PrismaClient) {
		this.taskEventRepository = db.taskEvent;
		this.commitRepository = db.commit;
		this.notificationRepository = db.notification;
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
		message,
	}: {
		taskId: string;
		authorId: string;
		message: string;
	}): Promise<TaskEvent> {
		return this.taskEventRepository.create({
			data: {
				taskId,
				authorId,
				message,
			},
		});
	}
}
