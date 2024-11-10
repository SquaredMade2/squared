import type { Task, User } from "@squared/db";
import { prisma } from "../api";

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
