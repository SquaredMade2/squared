import "dotenv/config";
import {
	type Branch,
	type Comment,
	type Commit,
	type Database,
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
	type Table,
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
	workspacesTable
} from "@squared/db";
import createCustomLogger from "@squared/logger";

const logger = createCustomLogger("seed");

async function seedDB() {
	const remoteDb = createDb({
		databaseUrl: process.env.REMOTE_DATABASE_URL,
		isLocal: false,
	});

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
			insert: ({data, db}: {data: Workspace[], db: Database}) => db.insert(workspacesTable).values(data),
		},
		{
			name: "Users",
			fetch: () => remoteDb.select().from(usersTable),
			insert: ({data, db}: {data: User[], db: Database}) => db.insert(usersTable).values(data),
		},
		{
			name: "Teams",
			fetch: () => remoteDb.select().from(teamsTable),
			insert: ({ data, db }: { data: Team[], db: Database }) => db.insert(teamsTable).values(data),
	},
	{
			name: "Sprints",
			fetch: () => remoteDb.select().from(sprintsTable),
			insert: ({ data, db }: { data: Sprint[], db: Database }) => db.insert(sprintsTable).values(data),
	},
	{
			name: "Tasks",
			fetch: () =>
					remoteDb.select().from(tasksTable)
							.then((tasks) => tasks.sort((a) => (a.parentId ? 1 : -1))),
			insert: ({ data, db }: { data: Task[], db: Database }) => db.insert(tasksTable).values(data),
	},
	{
			name: "Comments",
			fetch: () => remoteDb.select().from(commentsTable),
			insert: ({ data, db }: { data: Comment[], db: Database }) => db.insert(commentsTable).values(data),
	},
	{
			name: "Notifications",
			fetch: () => remoteDb.select().from(notificationsTable),
			insert: ({ data, db }: { data: Notification[], db: Database }) => db.insert(notificationsTable).values(data),
	},
	{
			name: "SavedFilters",
			fetch: () => remoteDb.select().from(savedFiltersTable),
			insert: ({ data, db }: { data: SavedFilter[], db: Database }) => db.insert(savedFiltersTable).values(data),
	},
	{
			name: "UniversalTokenLinks",
			fetch: () => remoteDb.select().from(universalTokenLinksTable),
			insert: ({ data, db }: { data: UniversalTokenLink[], db: Database }) => db.insert(universalTokenLinksTable).values(data),
	},
	{
			name: "GithubRepoInfo",
			fetch: () => remoteDb.select().from(githubRepoInfoTable),
			insert: ({ data, db }: { data: GithubRepoInfo[], db: Database }) => db.insert(githubRepoInfoTable).values(data),
	},
	{
			name: "WorkspaceRepositories",
			fetch: () => remoteDb.select().from(workspaceRepositoriesTable),
			insert: ({ data, db }: { data: WorkspaceRepositories[], db: Database }) => db.insert(workspaceRepositoriesTable).values(data),
	},
	{
			name: "Projects",
			fetch: () => remoteDb.select().from(projectsTable),
			insert: ({ data, db }: { data: Project[], db: Database }) => db.insert(projectsTable).values(data),
	},
	{
			name: "RetrospectiveItems",
			fetch: () => remoteDb.select().from(retrospectiveItemsTable),
			insert: ({ data, db }: { data: RetrospectiveItem[], db: Database }) => db.insert(retrospectiveItemsTable).values(data),
	},
	{
			name: "Branches",
			fetch: () => remoteDb.select().from(branchesTable),
			insert: ({ data, db }: { data: Branch[], db: Database }) => db.insert(branchesTable).values(data),
	},
	{
			name: "Commits",
			fetch: () => remoteDb.select().from(commitsTable),
			insert: ({ data, db }: { data: Commit[], db: Database }) => db.insert(commitsTable).values(data),
	},
	{
			name: "TaskEvents",
			fetch: () => remoteDb.select().from(taskEventsTable),
			insert: ({ data, db }: { data: TaskEvent[], db: Database }) => db.insert(taskEventsTable).values(data),
	},
	{
			name: "UserWorkspaces",
			fetch: () => remoteDb.select().from(userWorkspacesTable),
			insert: ({ data, db }: { data: UserWorkspace[], db: Database }) => db.insert(userWorkspacesTable).values(data),
	},
	{
			name: "UserTeams",
			fetch: () => remoteDb.select().from(userTeamsTable),
			insert: ({ data, db }: { data: UserTeam[], db: Database }) => db.insert(userTeamsTable).values(data),
	},
	];

	const remoteData = await remoteDb.transaction(async () => {
		try {
			// fetch functions
			const remoteData: Table[][] = []
			for (let i = 0; i < fetchAndInsertFunctions.length; i++) {
				const {name, fetch} = fetchAndInsertFunctions[i]
				logger.info(`fetching ${name}...`);
				const data = await fetch();
				remoteData.push([])
				for (let j = 0; j < data.length; j++) {
					remoteData[i].push(data[j])
				}
			}
			
			logger.info("fetch completed successfully");
			return remoteData
		} catch (error) {
			console.error("fetch failed:", error);
		}})


		const db = createDb({ databaseUrl: process.env.DATABASE_URL });

		try {
			await db.transaction(async () => {
				for(let i = 0; i < fetchAndInsertFunctions.length; i++) {
					const {name, insert} = fetchAndInsertFunctions[i]
					logger.info(`inserting ${name}`)
					if(remoteData) {
						for(let j=0; j < remoteData[i].length; j++) {
							await insert({data: remoteData[i][j], db}).onConflictDoNothing();
						}
					}
				}
			})
			logger.info("insertions completed successfully")
		} catch (error) {
			console.error("inserting data failed:", error);
		}
		logger.info("Database seeding completed");
	}



seedDB().catch((e) => {
	logger.error("Error seeding database: %s", e);
});

logger.info("Seed script executed. Check the logs for results.");
