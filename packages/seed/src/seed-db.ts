import { faker } from "@faker-js/faker";
import {
	addComment,
	addMainUser,
	addTask,
	addTeam,
	addUser,
	addUserToWorkspace,
	addWorkspace,
	prisma,
} from "./helpers";

async function seedDB() {
	const workspaces = await Promise.all([
		addWorkspace(),
		addWorkspace(),
		addWorkspace(),
	]);

	const user = await addMainUser();

	for (const workspace of workspaces) {
		await addUserToWorkspace(user, workspace);

		const numTeams = faker.number.int({ min: 1, max: 2 });

		for (let j = 0; j < numTeams; j++) {
			const team = await addTeam(workspace, user);
			const numUsers = faker.number.int({ min: 3, max: 6 });
			const numTasks = faker.number.int({ min: 30, max: 50 });
			const users = [user];
			for (let i = 0; i < numUsers; i++) {
				const newUser = await addUser();
				await addUserToWorkspace(newUser, workspace);
				users.push(newUser);
			}

			for (let l = 0; l < numTasks; l++) {
				const author =
					users[faker.number.int({ min: 0, max: users.length - 1 })];
				const task = await addTask(team, workspace, author);
				const numComments = faker.number.int({ min: 0, max: 3 });

				for (let c = 0; c < numComments; c++) {
					const author =
						users[faker.number.int({ min: 0, max: users.length - 1 })];
					await addComment(author.id, task.id);
				}
			}
		}
	}
	console.log("Database seeding completed");
}

seedDB()
	.then(() => {
		console.log("Seed completed");
		return prisma.$disconnect();
	})
	.catch((e) => {
		console.error(e);
		return prisma.$disconnect();
	});
