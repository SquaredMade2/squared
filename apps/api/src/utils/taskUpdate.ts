import type { Task, TaskEvent, TaskEventLog, Activity, User } from "@repo/db";
import { prisma } from "../api";

export async function trackChange(author: User, changes: Task, task: Task) {
	let changeType = "";
	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
	let changeValue;
	const keys = Object.keys(changes);

	for (const element of keys) {
		changeType = element;
		changeValue = changes[element as keyof typeof changes];
	}

	const eventLog = await prisma.taskEventLog.upsert({
		where: {
			taskId: task.id,
		},
		update: {},
		create: {
			taskId: task.id,
			authorId: author.id,
			authorName: author.name,
		} as TaskEventLog,
	});

	const newActivity = await prisma.activity.create({
		data: {
			type: "TASK_EVENT",
			eventLogId: eventLog.id,
		} as Activity,
	});

	await prisma.taskEvent.create({
		data: {
			type: changeType,
			authorId: author.id,
			authorName: author.name,
			taskId: eventLog.id,
			updatedValue: changeValue,
			activityId: newActivity.id,
		} as TaskEvent,
	});
}

export async function createLog(author: User, task: Task) {
	const eventLog = await prisma.taskEventLog.upsert({
		where: {
			taskId: task.id,
		},
		update: {},
		create: {
			taskId: task.id,
			authorId: author.id,
			authorName: author.name,
		} as TaskEventLog,
	});

	const newActivity = await prisma.activity.create({
		data: {
			type: "TASK_EVENT",
			eventLogId: eventLog.id,
		} as Activity,
	});

	await prisma.taskEvent.create({
		data: {
			type: "create",
			authorId: author.id,
			authorName: author.name,
			taskId: eventLog.id,
			updatedValue: task.title,
			activityId: newActivity.id,
		} as TaskEvent,
	});
}

export async function subscribeUser(user: User, task: Task) {
	if (!user.subscribedTasks.includes(task.id)) {
		await prisma.user.update({
			where: { id: user.id },
			data: {
				subscribedTasks: {
					push: task.id,
				},
			},
		});
	}
}
