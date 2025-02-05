import "dotenv/config";
import {
	type Branch,
	type Comment,
	type Commit,
	type GithubRepoInfo,
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
	createDb,
	githubRepoInfoTable,
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
	createRemoteDb,
	// remoteDb
} from "@squared/db";
// import * as schema from "./schema";
import createCustomLogger from "@squared/logger";


const logger = createCustomLogger("seed");

// const db = createDb({ databaseUrl: process.env.DATABASE_URL });
const remoteDb = createRemoteDb({ databaseUrl: process.env.REMOTE_DATABASE_URL})

async function seedDB() {
		console.log("RUNNING FETCH with remotedb: ")
		const data = await remoteDb.select().from(workspacesTable)
		console.log(data, 'REMOTE DATA IS HERE: ')
		const data2 = await remoteDb.select().from(usersTable)
		console.log('ALSO DATA BUT USERS: ', data2)

	// interface FetchFunction<T> {
	// 	name: string;
	// 	fetch: () => Promise<T[]>;
	// 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// 	insert: (data: T) => any;
	// }
	// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// const migrationFunctions: FetchFunction<any>[] = [
	// 	{
	// 		name: "Workspaces",
	// 		fetch: () => remoteDb.select().from(workspacesTable),
	// 		insert: (data: Workspace[]) => db.insert(workspacesTable).values(data),
	// 	},
	// 	{
	// 		name: "Users",
	// 		fetch: () => remoteDb.select().from(usersTable),
	// 		insert: (data: User) => db.insert(usersTable).values(data),
	// 	},
	// 	{
	// 		name: "Teams",
	// 		fetch: () => remoteDb.select().from(teamsTable),
	// 		insert: (data: Team[]) => db.insert(teamsTable).values(data),
	// 	},
	// 	{
	// 		name: "Sprints",
	// 		fetch: () => remoteDb.select().from(sprintsTable),
	// 		insert: (data: Sprint) => db.insert(sprintsTable).values(data),
	// 	},
	// 	{
	// 		name: "Tasks",
	// 		fetch: () =>
	// 			remoteDb.select().from(tasksTable)
	// 				.then((tasks) => tasks.sort((a) => (a.parentId ? 1 : -1))),
	// 		insert: (data: Task[]) => db.insert(tasksTable).values(data),
	// 	},
	// 	{
	// 		name: "Comments",
	// 		fetch: () => remoteDb.select().from(commentsTable),
	// 		insert: (data: Comment[]) => db.insert(commentsTable).values(data),
	// 	},
	// 	{
	// 		name: "Notifications",
	// 		fetch: () => remoteDb.select().from(notificationsTable),
	// 		insert: (data: Notification) =>
	// 			db.insert(notificationsTable).values(data),
	// 	},
	// 	{
	// 		name: "SavedFilters",
	// 		fetch: () => remoteDb.select().from(savedFiltersTable),
	// 		insert: (data: SavedFilter[]) =>
	// 			db.insert(savedFiltersTable).values({ ...data, filter: data.filter }),
	// 	},
	// 	{
	// 		name: "UniversalTokenLinks",
	// 		fetch: () => remoteDb.select().from(universalTokenLinksTable),
	// 		insert: (data: UniversalTokenLink) =>
	// 			db.insert(universalTokenLinksTable).values(data),
	// 	},
	// 	{
	// 		name: "GithubRepoInfo",
	// 		fetch: () => remoteDb.select().from(githubRepoInfoTable),
	// 		insert: (data: GithubRepoInfo) =>
	// 			db.insert(githubRepoInfoTable).values(data),
	// 	},
	// 	{
	// 		name: "WorkspaceRepositories",
	// 		fetch: () => remoteDb.select().from(workspaceRepositoriesTable),
	// 		insert: (data: WorkspaceRepositories) =>
	// 			db.insert(workspaceRepositoriesTable).values(data),
	// 	},
	// 	{
	// 		name: "Projects",
	// 		fetch: () => remoteDb.select().from(projectsTable),
	// 		insert: (data: Project) => db.insert(projectsTable).values(data),
	// 	},
	// 	{
	// 		name: "RetrospectiveItems",
	// 		fetch: () => remoteDb.select().from(retrospectiveItemsTable),
	// 		insert: (data: RetrospectiveItem) =>
	// 			db.insert(retrospectiveItemsTable).values(data),
	// 	},
	// 	{
	// 		name: "Branches",
	// 		fetch: () => remoteDb.select().from(branchesTable),
	// 		insert: (data: Branch) => db.insert(branchesTable).values(data),
	// 	},
	// 	{
	// 		name: "Commits",
	// 		fetch: () => remoteDb.select().from(commitsTable),
	// 		insert: (data: Commit) => db.insert(commitsTable).values(data),
	// 	},
	// 	{
	// 		name: "TaskEvents",
	// 		fetch: () => remoteDb.select().from(taskEventsTable),
	// 		insert: (data: TaskEvent) => db.insert(taskEventsTable).values(data),
	// 	},
	// 	{
	// 		name: "UserWorkspaces",
	// 		fetch: () => remoteDb.select().from(userWorkspacesTable),
	// 		insert: (data: UserWorkspace) =>
	// 			db.insert(userWorkspacesTable).values(data),
	// 	},
	// 	{
	// 		name: "UserTeams",
	// 		fetch: () => remoteDb.select().from(userTeamsTable),
	// 		insert: (data: UserTeam) => db.insert(userTeamsTable).values(data),
	// 	},
	// ];
	
	// await remoteDb.transaction(async () => {
	// 	console.log("INSIDE REMOTEDB TRANSACTION")
	// 	try {
	// 		// fetch functions
	
	// 		// Perform migrations
	// 		for (const { name, fetch } of migrationFunctions) {
	// 			console.log(`fetching ${name}...`);
	// 			const data = await fetch();
	// 			for (const item of data) {
	// 				console.log('ITEM HERE: ', item)
	// 			}
	// 			console.log(`${name} fetched`);
	// 		}
	
	// 		console.log("fetch completed successfully");
	// 	} catch (error) {
	// 		console.error("fetch failed:", error);
	// 	}})

	// 	try {
	// 		await db.transaction(async () => {
	// 			for(const {name, insert} of migrationFunctions) {
	// 				for(const item of fetchedData[name]) {
	// 					await insert(item).onConflictDoNothing();
	// 				}
	// 			}
	// 		})
	// 	} catch (error) {
	// 		console.error("inserting data failed:", error);
	// 	}
	// })

	logger.info("Database seeding completed");
}

seedDB().catch((e) => {
	logger.error("Error seeding database: %s", e);
});

console.log("Seed script executed. Check the logs for results.");
