import { PrismaClient } from "@prisma/client";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

const db = drizzle({ client, schema });

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
				insert: (data: schema.Workspace[]) =>
					db.insert(schema.workspacesTable).values(data),
			},
			{
				name: "Users",
				fetch: () => prisma.user.findMany(),
				insert: (data: schema.User) =>
					db.insert(schema.usersTable).values(data),
			},
			{
				name: "Teams",
				fetch: () => prisma.team.findMany(),
				insert: (data: schema.Team[]) =>
					db.insert(schema.teamsTable).values(data),
			},
			{
				name: "Sprints",
				fetch: () => prisma.sprint.findMany(),
				insert: (data: schema.Sprint) =>
					db.insert(schema.sprintsTable).values(data),
			},
			{
				name: "Tasks",
				fetch: () =>
					prisma.task
						.findMany()
						.then((tasks) => tasks.sort((a) => (a.parentId ? 1 : -1))),
				insert: (data: schema.Task[]) =>
					db.insert(schema.tasksTable).values(data),
			},
			{
				name: "Comments",
				fetch: () => prisma.comment.findMany(),
				insert: (data: schema.Comment[]) =>
					db.insert(schema.commentsTable).values(data),
			},
			{
				name: "Notifications",
				fetch: () => prisma.notification.findMany(),
				insert: (data: schema.Notification) =>
					db.insert(schema.notificationsTable).values(data),
			},
			{
				name: "Labels",
				fetch: () => prisma.label.findMany(),
				insert: (data: schema.Label) =>
					db.insert(schema.labelsTable).values(data),
			},
			{
				name: "SavedFilters",
				fetch: () => prisma.savedFilter.findMany(),
				insert: (data: schema.SavedFilter[]) =>
					db
						.insert(schema.savedFiltersTable)
						.values({ ...data, filter: data.filter }),
			},
			{
				name: "UniversalTokenLinks",
				fetch: () => prisma.universalTokenLink.findMany(),
				insert: (data: schema.UniversalTokenLink) =>
					db.insert(schema.universalTokenLinksTable).values(data),
			},
			{
				name: "GithubRepoInfo",
				fetch: () => prisma.githubRepoInfo.findMany(),
				insert: (data: schema.GithubRepoInfo) =>
					db.insert(schema.githubRepoInfoTable).values(data),
			},
			{
				name: "WorkspaceRepositories",
				fetch: () => prisma.workspaceRepositories.findMany(),
				insert: (data: schema.WorkspaceRepositories) =>
					db.insert(schema.workspaceRepositoriesTable).values(data),
			},
			{
				name: "Projects",
				fetch: () => prisma.project.findMany(),
				insert: (data: schema.Project) =>
					db.insert(schema.projectsTable).values(data),
			},
			{
				name: "RetrospectiveItems",
				fetch: () => prisma.retrospectiveItem.findMany(),
				insert: (data: schema.RetrospectiveItem) =>
					db.insert(schema.retrospectiveItemsTable).values(data),
			},
			{
				name: "Branches",
				fetch: () => prisma.branch.findMany(),
				insert: (data: schema.Branch) =>
					db.insert(schema.branchesTable).values(data),
			},
			{
				name: "Commits",
				fetch: () => prisma.commit.findMany(),
				insert: (data: schema.Commit) =>
					db.insert(schema.commitsTable).values(data),
			},
			{
				name: "TaskEvents",
				fetch: () => prisma.taskEvent.findMany(),
				insert: (data: schema.TaskEvent) =>
					db.insert(schema.taskEventsTable).values(data),
			},
			{
				name: "UserWorkspaces",
				fetch: () => prisma.userWorkspace.findMany(),
				insert: (data: schema.UserWorkspace) =>
					db.insert(schema.userWorkspacesTable).values(data),
			},
			{
				name: "UserTeams",
				fetch: () => prisma.userTeam.findMany(),
				insert: (data: schema.UserTeam) =>
					db.insert(schema.userTeamsTable).values(data),
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
