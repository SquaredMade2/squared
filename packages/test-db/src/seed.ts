import { PrismaClient, Status, Priority, Label } from "../generated/client";
import type { Team, User, Workspace } from "../generated/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedDB() {
	const numUsers = faker.number.int({ min: 5, max: 10 });

	for (let i = 0; i < numUsers; i++) {
		const user = await addUser();
		const numWorkspaces = faker.number.int({ min: 1, max: 2 });

		for (let k = 0; k < numWorkspaces; k++) {
			const workspace = await addWorkspace(user);
			const numTeams = faker.number.int({ min: 1, max: 2 });

			for (let j = 0; j < numTeams; j++) {
				const team = await addTeam(workspace, user);
				const numTasks = faker.number.int({ min: 25, max: 40 });

				for (let l = 0; l < numTasks; l++) {
					const task = await addTask(team, workspace, user);
					const numComments = faker.number.int({ min: 0, max: 3 });

					for (let c = 0; c < numComments; c++) {
						const randomUserIndex = faker.number.int({
							min: 0,
							max: numUsers - 1,
						});
						await addComment(user.id, task.id);
					}
				}
			}
		}
	}

	console.log("Database seeding completed");
}

async function addUser() {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const fullName = `${firstName} ${lastName}`;
	const username = faker.internet.userName({ firstName, lastName });
	const email = faker.internet.email({ firstName, lastName });
	const password = faker.internet.password(); // Use hashing if needed

	const user = await prisma.user.create({
		data: {
			name: fullName,
			username,
			email,
			password,
			verified: true,
		},
	});
	return user;
}

async function addWorkspace(user: User) {
	const workspaceName = faker.internet.domainWord();
	const workspaceCompanySize = faker.number.int({ max: 1000 });

	const workspace = await prisma.workspace.create({
		data: {
			name: workspaceName,
			companySize: workspaceCompanySize,
			Users: {
				connect: { id: user.id },
			},
		},
	});

	return workspace;
}

async function addTeam(workspace: Workspace, user: User) {
	const teamName = faker.internet.domainWord();
	const teamIdentifier = faker.string.alpha({
		length: 3,
		casing: "upper",
	});

	const team = await prisma.team.create({
		data: {
			name: teamName,
			identifier: teamIdentifier,
			workspaceId: workspace.id,
			Users: {
				connect: { id: user.id },
			},
		},
	});

	return team;
}

async function addTask(team: Team, workspace: Workspace, user: User) {
	const taskTitle = faker.lorem.words({ min: 1, max: 3 });
	const taskDescription = faker.lorem.words({ min: 3, max: 5 });
	const taskStatus = faker.helpers.arrayElement([
		Status.backlog,
		Status.todo,
		Status.inProgress,
		Status.done,
		Status.canceled,
		Status.duplicate,
	]);
	const taskPriority = faker.helpers.arrayElement([
		Priority.noPriority,
		Priority.urgent,
		Priority.high,
		Priority.medium,
		Priority.low,
	]);
	const taskLabels = faker.helpers.arrayElements([
		Label.Bug,
		Label.Feature,
		Label.Improvement,
		Label.Red,
		Label.Test,
	]);
	const taskDueDate = faker.date.future();
	const taskEffortEstimate = faker.helpers.arrayElement([
		1, 2, 3, 5, 8, 13, 21,
	]);

	const task = await prisma.task.create({
		data: {
			authorId: user.id,
			title: taskTitle,
			description: taskDescription,
			status: taskStatus,
			priority: taskPriority,
			labels: taskLabels,
			dueDate: taskDueDate,
			effortEstimate: taskEffortEstimate,
			identifier: `${team.identifier}-${workspace.issuesCreated}`,
			teamId: team.id,
		},
	});

	await prisma.workspace.update({
		where: { id: workspace.id },
		data: { issuesCreated: { increment: 1 } },
	});

	await addNotification(user.id, task.id);

	return task;
}

async function addComment(userId: string, taskId: string) {
	const commentContent = faker.lorem.words({ min: 3, max: 5 });
	await prisma.comment.create({
		data: {
			comment: commentContent,
			authorId: userId,
			taskId: taskId,
		},
	});
}

async function addNotification(userId: string, taskId: string) {
	await prisma.notification.create({
		data: {
			userId,
			taskIds: [taskId],
			read: faker.datatype.boolean(),
			description: faker.lorem.sentence(),
			createdAt: faker.date.past(),
			updatedAt: faker.date.recent(),
		},
	});
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
