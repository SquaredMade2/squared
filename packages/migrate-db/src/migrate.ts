import { PrismaClient } from "@prisma/client";
import {
	type Branch,
	type Comment,
	type Commit,
	type GithubRepoInfo,
	type Label,
	type Notification,
	type Project,
	type RetrospectiveItem,
	type SavedFilter,
	type Sprint,
	type Task,
	type TaskEvent,
	type Team,
	type UniversalTokenLink,
	type User,
	type UserTeam,
	type UserWorkspace,
	type Workspace,
	type WorkspaceRepositories,
	branchesTable,
	commentsTable,
	commitsTable,
	githubRepoInfoTable,
	labelsTable,
	notificationsTable,
	projectsTable,
	retrospectiveItemsTable,
	savedFiltersTable,
	sprintsTable,
	taskEventsTable,
	tasksTable,
	teamsTable,
	universalTokenLinksTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspaceRepositoriesTable,
	workspacesTable,
} from "@squared/db";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

const db = drizzle({ client });

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.POSTGRES_PRISMA_URL,
		},
	},
});

async function migrateData() {
	try {
		// Connect to the database clients
		await client.connect();
		await prisma.$connect();
		console.log("Clients Connected");

		// Run Drizzle migrations
		await migrate(db, { migrationsFolder: "./src/migrations" });
		console.log("Drizzle migrations completed");

		// Define migration functions
		interface MigrationFunction<T> {
			name: string;
			fetch: () => Promise<T[]>;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			insert: (data: T) => any;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const migrationFunctions: MigrationFunction<any>[] = [
			{
				name: "Workspaces",
				fetch: () => prisma.workspace.findMany(),
				insert: (data: Workspace[]) => db.insert(workspacesTable).values(data),
			},
			{
				name: "Users",
				fetch: () => prisma.user.findMany(),
				insert: (data: User) => db.insert(usersTable).values(data),
			},
			{
				name: "Teams",
				fetch: () => prisma.team.findMany(),
				insert: (data: Team[]) => db.insert(teamsTable).values(data),
			},
			{
				name: "Sprints",
				fetch: () => prisma.sprint.findMany(),
				insert: (data: Sprint) => db.insert(sprintsTable).values(data),
			},
			{
				name: "Tasks",
				fetch: () =>
					prisma.task
						.findMany()
						.then((tasks) => tasks.sort((a) => (a.parentId ? 1 : -1))),
				insert: (data: Task[]) => db.insert(tasksTable).values(data),
			},
			{
				name: "Comments",
				fetch: () => prisma.comment.findMany(),
				insert: (data: Comment[]) => db.insert(commentsTable).values(data),
			},
			{
				name: "Notifications",
				fetch: () => prisma.notification.findMany(),
				insert: (data: Notification) =>
					db.insert(notificationsTable).values(data),
			},
			{
				name: "Labels",
				fetch: () => prisma.label.findMany(),
				insert: (data: Label) => db.insert(labelsTable).values(data),
			},
			{
				name: "SavedFilters",
				fetch: () => prisma.savedFilter.findMany(),
				insert: (data: SavedFilter[]) =>
					db.insert(savedFiltersTable).values({ ...data, filter: data.filter }),
			},
			{
				name: "UniversalTokenLinks",
				fetch: () => prisma.universalTokenLink.findMany(),
				insert: (data: UniversalTokenLink) =>
					db.insert(universalTokenLinksTable).values(data),
			},
			{
				name: "GithubRepoInfo",
				fetch: () => prisma.githubRepoInfo.findMany(),
				insert: (data: GithubRepoInfo) =>
					db.insert(githubRepoInfoTable).values(data),
			},
			{
				name: "WorkspaceRepositories",
				fetch: () => prisma.workspaceRepositories.findMany(),
				insert: (data: WorkspaceRepositories) =>
					db.insert(workspaceRepositoriesTable).values(data),
			},
			{
				name: "Projects",
				fetch: () => prisma.project.findMany(),
				insert: (data: Project) => db.insert(projectsTable).values(data),
			},
			{
				name: "RetrospectiveItems",
				fetch: () => prisma.retrospectiveItem.findMany(),
				insert: (data: RetrospectiveItem) =>
					db.insert(retrospectiveItemsTable).values(data),
			},
			{
				name: "Branches",
				fetch: () => prisma.branch.findMany(),
				insert: (data: Branch) => db.insert(branchesTable).values(data),
			},
			{
				name: "Commits",
				fetch: () => prisma.commit.findMany(),
				insert: (data: Commit) => db.insert(commitsTable).values(data),
			},
			{
				name: "TaskEvents",
				fetch: () => prisma.taskEvent.findMany(),
				insert: (data: TaskEvent) => db.insert(taskEventsTable).values(data),
			},
			{
				name: "UserWorkspaces",
				fetch: () => prisma.userWorkspace.findMany(),
				insert: (data: UserWorkspace) =>
					db.insert(userWorkspacesTable).values(data),
			},
			{
				name: "UserTeams",
				fetch: () => prisma.userTeam.findMany(),
				insert: (data: UserTeam) => db.insert(userTeamsTable).values(data),
			},
		];

		// Perform migrations
		for (const { name, fetch, insert } of migrationFunctions) {
			console.log(`Migrating ${name}...`);
			const data = await fetch();
			for (const item of data) {
				await insert(item).onConflictDoNothing();
			}
			console.log(`${name} migrated`);
		}

		console.log("Migration completed successfully");
	} catch (error) {
		console.error("Migration failed:", error);
	} finally {
		await client.end();
		await prisma.$disconnect();
	}
}

migrateData().catch((error) => {
	console.error("Unhandled error during migration:", error);
	process.exit(1);
});
