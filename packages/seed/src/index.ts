import { faker } from "@faker-js/faker";
import {
	type Label,
	Priority,
	Status,
	type Team,
	type TransactionClient,
	type User,
	type Workspace,
	commentsTable,
	createDb,
	eq,
	notificationsTable,
	sql,
	tasksTable,
	teamsTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspacesTable,
} from "@squared/db";
import createCustomLogger from "@squared/logger";
import "dotenv/config";

const logger = createCustomLogger("seed");

const db = createDb({ databaseUrl: process.env.DATABASE_URL });

async function seedDB() {
	await db.transaction(async (tx) => {
		const workspaces = await Promise.all([
			addWorkspace(tx),
			addWorkspace(tx),
			addWorkspace(tx),
		]);

		const user = await addMainUser(tx);

		for (const workspace of workspaces) {
			await addUserToWorkspace(tx, user, workspace, true);

			const numTeams = faker.number.int({ min: 1, max: 2 });

			for (let j = 0; j < numTeams; j++) {
				const team = await addTeam(tx, workspace, user);
				const numUsers = faker.number.int({ min: 3, max: 6 });
				const numTasks = faker.number.int({ min: 30, max: 50 });
				const users = [user];
				for (let i = 0; i < numUsers; i++) {
					const newUser = await addUser(tx);
					await addUserToWorkspace(tx, newUser, workspace, false);
					await addUserToTeam(tx, newUser, team);
					users.push(newUser);
				}

				for (let l = 0; l < numTasks; l++) {
					const author =
						users[faker.number.int({ min: 0, max: users.length - 1 })];
					const task = await addTask(tx, team, workspace, author);
					const numComments = faker.number.int({ min: 0, max: 3 });

					for (let c = 0; c < numComments; c++) {
						const author =
							users[faker.number.int({ min: 0, max: users.length - 1 })];
						await addComment(tx, author.externalId, task.id);
					}
				}
			}
		}
	});

	logger.info("Database seeding completed");
}

async function addMainUser(tx: TransactionClient) {
	const name = process.env.SEED_NAME || faker.person.fullName();
	const email = process.env.SEED_EMAIL || faker.internet.email();
	const externalId = process.env.CLERK_EXTERNAL_ID || faker.internet.password();
	const username = name.replace(" ", "");

	const [user] = await tx
		.insert(usersTable)
		.values({
			name: name,
			username,
			email,
			externalId,
			onBoarding: false,
			avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000)}`,
		})
		.returning();
	return user;
}

async function addUser(tx: TransactionClient) {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const fullName = `${firstName} ${lastName}`;
	const username = faker.internet.username({ firstName, lastName });
	const email = faker.internet.email({ firstName, lastName });
	const externalId = `user_${faker.internet.password()}`;

	const [user] = await tx
		.insert(usersTable)
		.values({
			name: fullName,
			username,
			email,
			externalId,
			onBoarding: false,
			avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000)}`,
		})
		.returning();

	return user;
}

async function addUserToWorkspace(
	tx: TransactionClient,
	user: User,
	workspace: Workspace,
	isFirstUser: boolean,
) {
	await tx.insert(userWorkspacesTable).values({
		userId: user.externalId,
		workspaceId: workspace.id,
		role: isFirstUser ? "owner" : "member",
	});
}

async function addUserToTeam(tx: TransactionClient, user: User, team: Team) {
	await tx.insert(userTeamsTable).values({
		userId: user.externalId,
		teamId: team.id,
	});
}

async function addWorkspace(tx: TransactionClient) {
	const workspaceName = faker.internet.domainWord();
	const workspaceCompanySize = faker.number.int({ max: 1000 });

	const defaultLabels = [
		{ name: "Feature", description: "New feature", color: "#FF5733" },
		{ name: "Bug", description: "Bug fix", color: "#C70039" },
		{ name: "Chore", description: "General task", color: "#900C3F" },
		{ name: "Refactor", description: "Code refactor", color: "#581845" },
		{ name: "Docs", description: "Documentation", color: "#FFC300" },
		{ name: "Test", description: "Testing task", color: "#DAF7A6" },
		{ name: "Design", description: "Design related task", color: "#33FFBD" },
	];

	const [workspace] = await tx
		.insert(workspacesTable)
		.values({
			name: workspaceName,
			companySize: workspaceCompanySize,
			url: workspaceName.split(" ").join("-").toLowerCase(),
			labels: defaultLabels,
		})
		.returning();

	return workspace;
}

async function addTeam(
	tx: TransactionClient,
	workspace: Workspace,
	user: User,
) {
	const teamName = faker.internet.domainWord();
	const teamIdentifier = faker.string.alpha({ length: 3, casing: "upper" });

	const [team] = await tx
		.insert(teamsTable)
		.values({
			name: teamName,
			identifier: teamIdentifier,
			workspaceId: workspace.id,
		})
		.returning();

	await tx.insert(userTeamsTable).values({
		userId: user.externalId,
		teamId: team.id,
	});

	return team;
}

const getRandomLabels = (labels: Label[]) => {
	const numLabels = faker.number.int({ min: 1, max: labels.length });
	return faker.helpers.shuffle(labels).slice(0, numLabels);
};

async function addTask(
	tx: TransactionClient,
	team: Team,
	workspace: Workspace,
	user: User,
) {
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

	const taskLabels = workspace.labels;

	const taskDueDate = faker.date.future();
	const taskEffortEstimate = faker.helpers.arrayElement([1, 2, 3, 4, 5]);

	const [updatedWorkspace] = await tx
		.update(workspacesTable)
		.set({ tasksCreated: sql`${workspacesTable.tasksCreated} + 1` })
		.where(eq(workspacesTable.id, workspace.id))
		.returning();

	const identifier = `${team.identifier}-${updatedWorkspace.tasksCreated + 1}`;
	const randomLabelIds = getRandomLabels(taskLabels);

	const data = {
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
	};

	const [task] = await tx
		.insert(tasksTable)
		.values({
			...data,
		})
		.returning();

	await addNotification(tx, user.externalId, task.id, workspace.id);

	return task;
}

async function addComment(
	tx: TransactionClient,
	userId: string,
	taskId: string,
) {
	const commentContent = faker.lorem.words({ min: 3, max: 5 });
	await tx.insert(commentsTable).values({
		comment: commentContent,
		authorId: userId,
		taskId: taskId,
	});
}

async function addNotification(
	tx: TransactionClient,
	userId: string,
	taskId: string,
	workspaceId: string,
) {
	await tx.insert(notificationsTable).values({
		userId,
		taskId,
		workspaceId,
		read: faker.datatype.boolean(),
		saved: faker.datatype.boolean(),
		description: faker.lorem.sentence(),
		dismissed: faker.datatype.boolean(),
		type: faker.helpers.arrayElement([
			"ASSIGNED",
			"PARTICIPATING",
			"MENTIONED",
			"CREATED",
		]),
	});
}

seedDB().catch((e) => {
	logger.error(`Error seeding database: ${(e as Error).message}`);
	// If you want to log the full error stack:
	logger.error(`Full error stack: ${(e as Error).stack}`);
});

console.log("Seed script executed. Check the logs for results.");
