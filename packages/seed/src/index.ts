import { faker } from "@faker-js/faker";
import type { Team, User, Workspace } from "@squared/db";
import { Priority, PrismaClient, Status } from "@squared/db";
import createCustomLogger from "@squared/logger";
import "dotenv/config";

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.POSTGRES_PRISMA_URL,
		},
	},
});

const logger = createCustomLogger("seed");

async function seedDB() {
	const workspaces = await Promise.all([
		addWorkspace(),
		addWorkspace(),
		addWorkspace(),
	]);

	const user = await addMainUser();

	for (const workspace of workspaces) {
		await addUserToWorkspace(user, workspace, true);

		const numTeams = faker.number.int({ min: 1, max: 2 });

		for (let j = 0; j < numTeams; j++) {
			const team = await addTeam(workspace, user);
			const numUsers = faker.number.int({ min: 3, max: 6 });
			const numTasks = faker.number.int({ min: 30, max: 50 });
			const users = [user];
			for (let i = 0; i < numUsers; i++) {
				const newUser = await addUser();
				await addUserToWorkspace(newUser, workspace, false);
				await addUserToTeam(newUser, team);
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
					await addComment(author.externalId, task.id);
				}
			}
		}
	}
	logger.info("Database seeding completed");
}

async function addMainUser() {
	const name = process.env.SEED_NAME || faker.person.fullName();
	const email = process.env.SEED_EMAIL || faker.internet.email();
	const externalId = process.env.CLERK_EXTERNAL_ID || faker.internet.password();
	const username = name.replace(" ", "");

	const user = await prisma.user.create({
		data: {
			name: name,
			username,
			email,
			externalId,
			onBoarding: false,
			avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000)}`,
		},
	});
	return user;
}

async function addUser() {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const fullName = `${firstName} ${lastName}`;
	const username = faker.internet.username({ firstName, lastName });
	const email = faker.internet.email({ firstName, lastName });
	const externalId = `user_${faker.internet.password()}`;

	const user = await prisma.user.create({
		data: {
			name: fullName,
			username,
			email,
			externalId,
			onBoarding: false,
			avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000)}`,
		},
	});
	return user;
}

async function addUserToWorkspace(
	user: User,
	workspace: Workspace,
	isFirstUser: boolean,
) {
	await prisma.workspace.update({
		where: { id: workspace.id },
		data: {
			Users: {
				create: {
					userId: user.externalId,
					role: isFirstUser ? "owner" : "member",
				},
			},
		},
	});
}

async function addUserToTeam(user: User, team: Team) {
	await prisma.team.update({
		where: { id: team.id },
		data: {
			Users: {
				create: {
					userId: user.externalId,
				},
			},
		},
	});
}

async function addWorkspace() {
	const workspaceName = faker.internet.domainWord();
	const workspaceCompanySize = faker.number.int({ max: 1000 });

	const workspace = await prisma.workspace.create({
		data: {
			name: workspaceName,
			companySize: workspaceCompanySize,
			url: workspaceName.split(" ").join("-").toLowerCase(),
		},
	});

	const defaultLabels = [
		{ name: "Feature", description: "New feature", color: "#FF5733" },
		{ name: "Bug", description: "Bug fix", color: "#C70039" },
		{ name: "Chore", description: "General task", color: "#900C3F" },
		{ name: "Refactor", description: "Code refactor", color: "#581845" },
		{ name: "Docs", description: "Documentation", color: "#FFC300" },
		{ name: "Test", description: "Testing task", color: "#DAF7A6" },
		{ name: "Design", description: "Design related task", color: "#33FFBD" },
	];

	await prisma.label.createMany({
		data: defaultLabels.map((label) => ({
			...label,
			workspaceId: workspace.id,
		})),
	});

	return workspace;
}

async function addTeam(workspace: Workspace, user: User) {
	const teamName = faker.internet.domainWord();
	const teamIdentifier = faker.string.alpha({ length: 3, casing: "upper" });

	const team = await prisma.team.create({
		data: {
			name: teamName,
			identifier: teamIdentifier,
			workspaceId: workspace.id,
			Users: {
				create: {
					userId: user.externalId,
				},
			},
		},
	});

	return team;
}

const getRandomLabels = (labels: { id: string }[]) => {
	const numLabels = faker.number.int({ min: 1, max: labels.length });
	return faker.helpers
		.shuffle(labels)
		.slice(0, numLabels)
		.map((label) => label.id);
};

async function addTask(team: Team, workspace: Workspace, user: User) {
	const taskTitle = faker.lorem.words({ min: 1, max: 3 });
	const taskDescription = faker.lorem.words({ min: 3, max: 5 });
	const taskStatus = faker.helpers.arrayElement([
		Status.backlog,
		Status.todo,
		Status.inProgress,
		Status.done,
		Status.inReview,
	]);
	const taskPriority = faker.helpers.arrayElement([
		Priority.noPriority,
		Priority.urgent,
		Priority.high,
		Priority.medium,
		Priority.low,
	]);

	const taskLabels = await prisma.label.findMany({
		where: { workspaceId: workspace.id },
	});

	const taskDueDate = faker.date.future();
	const taskEffortEstimate = faker.helpers.arrayElement([1, 2, 3, 4, 5]);

	const updatedWorkspace = await prisma.workspace.update({
		where: { id: workspace.id },
		data: { tasksCreated: { increment: 1 } },
	});

	const identifier = `${team.identifier}-${updatedWorkspace.tasksCreated + 1}`;
	const randomLabelIds = getRandomLabels(taskLabels);

	const task = await prisma.task.create({
		data: {
			authorId: user.externalId,
			title: taskTitle,
			description: taskDescription,
			status: taskStatus,
			priority: taskPriority,
			dueDate: taskDueDate,
			effortEstimate: taskEffortEstimate,
			identifier: identifier,
			teamId: team.id,
			assigneeId: user.externalId,
			labels: randomLabelIds,
			workspaceId: workspace.id,
		},
	});

	await addNotification(user.externalId, task.id, workspace.id);

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

async function addNotification(
	userId: string,
	taskId: string,
	workspaceId: string,
) {
	await prisma.notification.create({
		data: {
			userId,
			taskId,
			workspaceId,
			read: faker.datatype.boolean(),
			saved: faker.datatype.boolean(),
			description: faker.lorem.sentence(),
			createdAt: faker.date.past(),
			updatedAt: faker.date.recent(),
			type: faker.helpers.arrayElement([
				"ASSIGNED",
				"PARTICIPATING",
				"MENTIONED",
				"CREATED",
			]),
		},
	});
}

seedDB()
	.then(() => {
		logger.info("Seed completed");
		return prisma.$disconnect();
	})
	.catch((e) => {
		logger.error("Error seeding database: %s", e);
		return prisma.$disconnect();
	});
