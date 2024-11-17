import type { PrismaClient, Task, User } from "@squared/db";

export async function subscribeUser(
	user: User,
	task: Task,
	prisma: PrismaClient,
) {
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
