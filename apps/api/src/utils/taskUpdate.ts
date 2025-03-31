import {
	type Task,
	type TransactionClient,
	type User,
	eq,
	usersTable,
} from "@squaredmade/db";

export async function subscribeUser(
	user: User,
	task: Task,
	tx: TransactionClient,
) {
	if (user.subscribedTasks && !user.subscribedTasks?.includes(task.id)) {
		await tx
			.update(usersTable)
			.set({
				subscribedTasks: [...user.subscribedTasks, task.id],
			})
			.where(eq(usersTable.id, user.id));
	}
}
