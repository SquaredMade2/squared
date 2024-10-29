import type { Task, User } from "@squared/db";
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

	const event = `${author.name}_${changeType}#${changeValue}`;

	Promise.all([
		await prisma.taskEvent.create({
			data: {
				taskId: task.id,
				authorId: author.id,
				authorName: author.name,
				message: event,
			},
		}),
		await prisma.notification.create({
			data: {
				taskId: task.id,
				workspaceId: task.workspaceId,
				type: "PARTICIPATING",
				userId: author.id,
				description: event,
			},
		}),
	]);
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
