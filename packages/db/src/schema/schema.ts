import {
	boolean,
	foreignKey,
	index,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import {
	type FilterCondition,
	effortType,
	notificationType,
	priorityType,
	pullRequestState,
	retrospectiveItemType,
	savedFilterType,
	sprintStatusType,
	statusType,
} from "./types";

const DEFAULT_LABELS = [
	{
		name: "Feature",
		description: "New functionality or enhancement to the application",
		color: "#FF5733",
	},
	{
		name: "Bug",
		description: "Issue that causes unexpected behavior or application failure",
		color: "#C70039",
	},
	{
		name: "Chore",
		description: "Routine maintenance task not affecting production code",
		color: "#900C3F",
	},
	{
		name: "Refactor",
		description: "Code improvement that doesn't change external behavior",
		color: "#581845",
	},
	{
		name: "Docs",
		description: "Improvements or additions to documentation",
		color: "#FFC300",
	},
	{
		name: "Test",
		description: "Adding or modifying test cases and testing infrastructure",
		color: "#DAF7A6",
	},
	{
		name: "Design",
		description: "UI/UX improvements or visual design elements",
		color: "#33FFBD",
	},
];

export const teamsTable = pgTable(
	"Team",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text(),
		identifier: text().notNull(),
		workspaceId: text().notNull(),
		sprintsEnabled: boolean().default(false).notNull(),
		sprintDuration: integer().default(2).notNull(),
		cooldownDuration: integer().default(1).notNull(),
		sprintStartDate: timestamp({ precision: 3 }).defaultNow().notNull(),
		tasksPerSprint: integer().default(10).notNull(),
		effort: effortType().default("LINEAR").notNull(),
	},
	(table) => [
		uniqueIndex("Team_workspaceId_identifier_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("uuid_ops"),
			table.identifier.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.externalId],
			name: "Team_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const githubCommitsTable = pgTable(
	"GithubCommit",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		externalId: text().notNull().unique(),
		message: text(),
		url: text().notNull(),
		author: text(),
		repoId: text().notNull(),
		pullId: text().notNull(),
		timestamp: timestamp({ precision: 3 }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.pullId],
			foreignColumns: [githubPullRequestsTable.externalId],
			name: "Commit_pull_request_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.repoId],
			foreignColumns: [githubRepoTable.externalId],
			name: "Commit_task_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const githubPullRequestsTable = pgTable(
	"GithubPullRequest",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		externalId: text().notNull().unique(),
		number: integer().notNull(),
		state: pullRequestState().notNull(),
		title: text().notNull(),
		url: text().notNull(),
		branch: text().notNull(),
		timestamp: timestamp({ precision: 3 }).notNull(),
		body: text(),
		author: text().notNull(),
		githubRepoInfoId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.githubRepoInfoId],
			foreignColumns: [githubRepoTable.externalId],
			name: "Branch_githubRepoInfoId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const githubRepoTable = pgTable(
	"GithubRepo",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		externalId: text().notNull().unique(),
		private: boolean().default(false).notNull(),
		description: text(),
		url: text().notNull(),
		name: text().default("").notNull(),
		orgId: text().notNull(),
	},
	(table) => [
		uniqueIndex("GithubRepoInfo_name_key").using(
			"btree",
			table.name.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.orgId],
			foreignColumns: [githubOrgTable.externalId],
			name: "GithubRepoInfo_orgId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const githubOrgTable = pgTable(
	"GithubOrg",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		externalId: text().notNull().unique(),
		name: text().notNull(),
		description: text(),
		workspaceId: text().notNull().unique(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("GithubOrg_name_key").using(
			"btree",
			table.name.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.externalId],
			name: "GithubOrg_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		uniqueIndex("GithubOrg_workspaceId_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("text_ops"),
		),
	],
);

export const sprintsTable = pgTable(
	"Sprint",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		startDate: timestamp({ precision: 3 }).notNull(),
		endDate: timestamp({ precision: 3 }).notNull(),
		status: sprintStatusType().notNull(),
		teamId: uuid().notNull(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		updatedAt: timestamp({ precision: 3 })
			.defaultNow()
			.$onUpdateFn(() => new Date())
			.notNull(),
		description: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
			name: "Sprint_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const notificationsTable = pgTable(
	"Notification",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		taskId: uuid().notNull(),
		read: boolean().default(false).notNull(),
		saved: boolean().default(false).notNull(),
		description: text(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		updatedAt: timestamp({ precision: 3 })
			.defaultNow()
			.$onUpdateFn(() => new Date())
			.notNull(),
		workspaceId: text().notNull(),
		dismissed: boolean().default(false).notNull(),
		type: notificationType().notNull(),
		userId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.taskId],
			foreignColumns: [tasksTable.id],
			name: "Notification_taskId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.externalId],
			name: "Notification_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersTable.externalId],
			name: "Notification_userId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const workspacesTable = pgTable(
	"Workspace",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		externalId: text().notNull().unique(),
		name: text().notNull(),
		url: text().notNull(),
		companySize: integer(),
		tasksCreated: integer().default(0).notNull(),
		avatarUrl: text(),
		admins: text().array().default([]).notNull(),
		defaultView: text(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		labels: jsonb().$type<Label[]>().default(DEFAULT_LABELS).notNull(),
		inviteLinks: jsonb().$type<WorkspaceInviteLink[]>().default([]).notNull(),
		archiveConfig: jsonb()
			.$type<ArchiveConfig>()
			.default({
				enabled: false,
				daysUntilArchive: 30,
				lastArchiveRun: null,
			})
			.notNull(),
	},
	(table) => [
		uniqueIndex("Workspace_url_key").using(
			"btree",
			table.url.asc().nullsLast().op("text_ops"),
		),
	],
);

export const usersTable = pgTable(
	"User",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		username: text(),
		email: text().notNull(),
		onBoarding: boolean().default(true).notNull(),
		defaultWorkspaceId: text(),
		avatarUrl: text(),
		savedNotificationIds: uuid().array().default([]).notNull(),
		subscribedTasks: text().array().default([]).notNull(),
		githubUsername: text(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		lastViewedTaskId: uuid(),
		externalId: text().unique().notNull(),
	},
	(table) => [
		uniqueIndex("User_email_key").using(
			"btree",
			table.email.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.defaultWorkspaceId],
			foreignColumns: [workspacesTable.externalId],
			name: "User_defaultWorkspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
	],
);

export const commentsTable = pgTable(
	"Comment",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		comment: text().notNull(),
		date: timestamp({ precision: 3 }).defaultNow().notNull(),
		taskId: uuid().notNull(),
		authorId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.taskId],
			foreignColumns: [tasksTable.id],
			name: "Comment_taskId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [usersTable.externalId],
			name: "Comment_authorId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const tasksTable = pgTable(
	"Task",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		title: text().notNull(),
		description: text(),
		identifier: text().notNull(),
		dueDate: timestamp({ precision: 3 }),
		effortEstimate: integer(),
		teamId: uuid().notNull(),
		dateCreated: timestamp({ precision: 3 }).defaultNow().notNull(),
		labels: jsonb().$type<Label[]>().default([]).notNull(),
		workspaceId: text().notNull(),
		updatedAt: timestamp({ precision: 3 })
			.defaultNow()
			.$onUpdateFn(() => new Date())
			.notNull(),
		deleted: boolean().default(false).notNull(),
		parentId: uuid(),
		sprintId: uuid(),
		status: statusType().default("backlog").notNull(),
		priority: priorityType().default("noPriority").notNull(),
		order: integer().default(0).notNull(),
		authorId: text().notNull(),
		assigneeId: text(),
	},
	(table) => [
		uniqueIndex("Task_teamId_identifier_key").using(
			"btree",
			table.teamId.asc().nullsLast().op("uuid_ops"),
			table.identifier.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("Task_workspaceId_identifier_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("uuid_ops"),
			table.identifier.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "Task_parentId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
			name: "Task_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.externalId],
			name: "Task_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.sprintId],
			foreignColumns: [sprintsTable.id],
			name: "Task_sprintId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [usersTable.externalId],
			name: "Task_authorId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.assigneeId],
			foreignColumns: [usersTable.externalId],
			name: "Task_assigneeId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
	],
);

export const workspaceRepositoriesTable = pgTable(
	"WorkspaceRepositories",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		workspaceId: text().notNull(),
		repoId: uuid().notNull(),
	},
	(table) => [
		uniqueIndex("WorkspaceRepositories_workspaceId_repoId_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("uuid_ops"),
			table.repoId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.externalId],
			name: "WorkspaceRepositories_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.repoId],
			foreignColumns: [githubRepoTable.id],
			name: "WorkspaceRepositories_repoId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const projectsTable = pgTable(
	"Project",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		teamId: uuid(),
		workspaceId: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
			name: "Project_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.externalId],
			name: "Project_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const taskEventsTable = pgTable(
	"TaskEvent",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		taskId: uuid().notNull(),
		message: text().notNull(),
		authorId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.taskId],
			foreignColumns: [tasksTable.id],
			name: "TaskEvent_taskId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [usersTable.externalId],
			name: "TaskEvent_authorId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const savedFiltersTable = pgTable(
	"SavedFilter",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		description: text().default(""),
		filter: jsonb().$type<FilterCondition[]>().notNull(),
		workspaceId: text(),
		teamId: uuid(),
		type: savedFilterType().notNull(),
		sprintId: uuid(),
		authorId: text().notNull(),
	},
	(table) => [
		index("teamIdx").using(
			"btree",
			table.teamId.asc().nullsLast().op("uuid_ops"),
		),
		index("workspaceIdx").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.externalId],
			name: "SavedFilter_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
			name: "SavedFilter_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [usersTable.externalId],
			name: "SavedFilter_authorId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const retrospectiveItemsTable = pgTable(
	"RetrospectiveItem",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		content: text().notNull(),
		sprintId: uuid(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		updatedAt: timestamp({ precision: 3 })
			.defaultNow()
			.$onUpdateFn(() => new Date())
			.notNull(),
		type: retrospectiveItemType().default("toImprove").notNull(),
		likes: text().array().default([]).notNull(),
		authorId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.sprintId],
			foreignColumns: [sprintsTable.id],
			name: "RetrospectiveItem_sprintId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [usersTable.externalId],
			name: "RetrospectiveItem_authorId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const blockedTasksTable = pgTable(
	"_BlockedTasks",
	{
		a: uuid("A").notNull(),
		b: uuid("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("uuid_ops")),
		foreignKey({
			columns: [table.a],
			foreignColumns: [tasksTable.id],
			name: "_BlockedTasks_A_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.b],
			foreignColumns: [tasksTable.id],
			name: "_BlockedTasks_B_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({ columns: [table.a, table.b], name: "_BlockedTasks_AB_pkey" }),
	],
);

export const userWorkspacesTable = pgTable(
	"UserWorkspace",
	{
		workspaceId: text().notNull(),
		userId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.externalId],
			name: "UserWorkspace_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersTable.externalId],
			name: "UserWorkspace_userId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({
			columns: [table.workspaceId, table.userId],
			name: "UserWorkspace_pkey",
		}),
	],
);

export const userTeamsTable = pgTable(
	"UserTeam",
	{
		teamId: uuid().notNull(),
		userId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
			name: "UserTeam_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [usersTable.externalId],
			name: "UserTeam_userId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({
			columns: [table.teamId, table.userId],
			name: "UserTeam_pkey",
		}),
	],
);

export const githubPullRequestTaskTable = pgTable(
	"GithubPullRequestTask",
	{
		pullRequestId: text().notNull(),
		taskId: uuid().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.pullRequestId],
			foreignColumns: [githubPullRequestsTable.externalId],
			name: "GithubPullRequestTask_pullRequestId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.taskId],
			foreignColumns: [tasksTable.id],
			name: "GithubPullRequestTask_taskId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		primaryKey({
			columns: [table.pullRequestId, table.taskId],
			name: "GithubPullRequestTask_pkey",
		}),
	],
);

export type BlockedTasks = typeof blockedTasksTable.$inferSelect;
export type GithubPullRequest = typeof githubPullRequestsTable.$inferSelect;
export type GithubCommit = typeof githubCommitsTable.$inferSelect;
export type GithubRepo = typeof githubRepoTable.$inferSelect;
export type GithubOrg = typeof githubOrgTable.$inferSelect;
export type Comment = typeof commentsTable.$inferSelect;
export type Label = {
	name: string;
	description?: string | null;
	color: string;
};
export type ArchiveConfig = {
	enabled: boolean;
	daysUntilArchive: number;
	lastArchiveRun: Date | null;
};
export type Notification = typeof notificationsTable.$inferSelect;
export type Project = typeof projectsTable.$inferSelect;
export type RetrospectiveItem = typeof retrospectiveItemsTable.$inferSelect;
export type SavedFilter = typeof savedFiltersTable.$inferSelect;
export type Sprint = typeof sprintsTable.$inferSelect;
export type Task = typeof tasksTable.$inferSelect;
export type TaskEvent = typeof taskEventsTable.$inferSelect;
export type Team = typeof teamsTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;
export type UserTeam = typeof userTeamsTable.$inferSelect;
export type UserWorkspace = typeof userWorkspacesTable.$inferSelect;
export type Workspace = typeof workspacesTable.$inferSelect;
export type WorkspaceRepositories =
	typeof workspaceRepositoriesTable.$inferSelect;
export type WorkspaceInviteLink = {
	link: string;
	expiration?: number;
	uses?: number;
};
