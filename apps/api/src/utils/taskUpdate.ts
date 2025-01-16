import {
	type DBClient,
	type Task,
	type User,
	eq,
	usersTable,
} from "@squared/db";

export async function subscribeUser(user: User, task: Task, db: DBClient) {
	if (user.subscribedTasks && !user.subscribedTasks?.includes(task.id)) {
		await db
			.update(usersTable)
			.set({
				subscribedTasks: [...user.subscribedTasks, task.id],
			})
			.where(eq(usersTable.id, user.id));
	}
}
