import "dotenv/config";
import {
	type Branch,
	type Comment,
	type Commit,
	type DBClient,
	type GithubRepoInfo,
	type Notification,
	type Project,
	type RetrospectiveItem,
	type SavedFilter,
	type Sprint,
	type Table,
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
} from "@squared/db";
import createCustomLogger from "@squared/logger";

const logger = createCustomLogger("seed");

async function seedDB() {
	const remoteDb = createDb({
		databaseUrl: process.env.REMOTE_DATABASE_URL,
		isRemote: true,
	});

	logger.info("Fetching Remote Data");
	interface FetchFunction<T> {
		name: string;
		fetch: () => Promise<T[]>;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		insert: (data: T) => any;
	}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const fetchAndInsertFunctions: FetchFunction<any>[] = [
		{
			name: "Workspaces",
			fetch: () => remoteDb.select().from(workspacesTable),
			insert: ({ data, db }: { data: Workspace[]; db: DBClient }) =>
				db.insert(workspacesTable).values(data),
		},
		{
			name: "Users",
			fetch: () => remoteDb.select().from(usersTable),
			insert: ({ data, db }: { data: User[]; db: DBClient }) =>
				db.insert(usersTable).values(data),
		},
		{
			name: "Teams",
			fetch: () => remoteDb.select().from(teamsTable),
			insert: ({ data, db }: { data: Team[]; db: DBClient }) =>
				db.insert(teamsTable).values(data),
		},
		{
			name: "Sprints",
			fetch: () => remoteDb.select().from(sprintsTable),
			insert: ({ data, db }: { data: Sprint[]; db: DBClient }) =>
				db.insert(sprintsTable).values(data),
		},
		{
			name: "Tasks",
			fetch: () =>
				remoteDb
					.select()
					.from(tasksTable)
					.then((tasks) => tasks.sort((a) => (a.parentId ? 1 : -1))),
			insert: ({ data, db }: { data: Task[]; db: DBClient }) =>
				db.insert(tasksTable).values(data),
		},
		{
			name: "Comments",
			fetch: () => remoteDb.select().from(commentsTable),
			insert: ({ data, db }: { data: Comment[]; db: DBClient }) =>
				db.insert(commentsTable).values(data),
		},
		{
			name: "Notifications",
			fetch: () => remoteDb.select().from(notificationsTable),
			insert: ({ data, db }: { data: Notification[]; db: DBClient }) =>
				db.insert(notificationsTable).values(data),
		},
		{
			name: "SavedFilters",
			fetch: () => remoteDb.select().from(savedFiltersTable),
			insert: ({ data, db }: { data: SavedFilter[]; db: DBClient }) =>
				db.insert(savedFiltersTable).values(data),
		},
		{
			name: "UniversalTokenLinks",
			fetch: () => remoteDb.select().from(universalTokenLinksTable),
			insert: ({ data, db }: { data: UniversalTokenLink[]; db: DBClient }) =>
				db.insert(universalTokenLinksTable).values(data),
		},
		{
			name: "GithubRepoInfo",
			fetch: () => remoteDb.select().from(githubRepoInfoTable),
			insert: ({ data, db }: { data: GithubRepoInfo[]; db: DBClient }) =>
				db.insert(githubRepoInfoTable).values(data),
		},
		{
			name: "WorkspaceRepositories",
			fetch: () => remoteDb.select().from(workspaceRepositoriesTable),
			insert: ({ data, db }: { data: WorkspaceRepositories[]; db: DBClient }) =>
				db.insert(workspaceRepositoriesTable).values(data),
		},
		{
			name: "Projects",
			fetch: () => remoteDb.select().from(projectsTable),
			insert: ({ data, db }: { data: Project[]; db: DBClient }) =>
				db.insert(projectsTable).values(data),
		},
		{
			name: "RetrospectiveItems",
			fetch: () => remoteDb.select().from(retrospectiveItemsTable),
			insert: ({ data, db }: { data: RetrospectiveItem[]; db: DBClient }) =>
				db.insert(retrospectiveItemsTable).values(data),
		},
		{
			name: "Branches",
			fetch: () => remoteDb.select().from(branchesTable),
			insert: ({ data, db }: { data: Branch[]; db: DBClient }) =>
				db.insert(branchesTable).values(data),
		},
		{
			name: "Commits",
			fetch: () => remoteDb.select().from(commitsTable),
			insert: ({ data, db }: { data: Commit[]; db: DBClient }) =>
				db.insert(commitsTable).values(data),
		},
		{
			name: "TaskEvents",
			fetch: () => remoteDb.select().from(taskEventsTable),
			insert: ({ data, db }: { data: TaskEvent[]; db: DBClient }) =>
				db.insert(taskEventsTable).values(data),
		},
		{
			name: "UserWorkspaces",
			fetch: () => remoteDb.select().from(userWorkspacesTable),
			insert: ({ data, db }: { data: UserWorkspace[]; db: DBClient }) =>
				db.insert(userWorkspacesTable).values(data),
		},
		{
			name: "UserTeams",
			fetch: () => remoteDb.select().from(userTeamsTable),
			insert: ({ data, db }: { data: UserTeam[]; db: DBClient }) =>
				db.insert(userTeamsTable).values(data),
		},
	];

	const remoteData = await remoteDb.transaction(async () => {
		try {
			// fetch functions
			const fetchedData: Table[][] = [];
			for (let i = 0; i < fetchAndInsertFunctions.length; i++) {
				const { name, fetch } = fetchAndInsertFunctions[i];
				logger.info(`fetching ${name}...`);
				const data = await fetch();
				fetchedData.push([]);
				for (let j = 0; j < data.length; j++) {
					fetchedData[i].push(data[j]);
				}
			}

			logger.info("fetch completed successfully");
			return fetchedData;
		} catch (error) {
			logger.error("fetch failed:", error);
			throw error;
		}
	});

	const db = createDb({ databaseUrl: process.env.DATABASE_URL });

	try {
		await db.transaction(async () => {
			for (let i = 0; i < fetchAndInsertFunctions.length; i++) {
				const { name, insert } = fetchAndInsertFunctions[i];
				logger.info(`inserting ${name}`);
				if (remoteData) {
					for (let j = 0; j < remoteData[i].length; j++) {
						await insert({ data: remoteData[i][j], db }).onConflictDoNothing();
					}
				}
			}
		});
		logger.info("insertions completed successfully");
	} catch (error) {
		logger.error("inserting data failed:", error);
		throw error;
	}
	logger.info("Database seeding completed");
}

seedDB().catch((e) => {
	logger.error("Error seeding database: %s", e);
	throw e;
});

logger.info("Seed script executed. Check the logs for results.");
