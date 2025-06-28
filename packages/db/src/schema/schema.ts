import { sql } from "drizzle-orm";
import {
	boolean,
	check,
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
	effortType,
	type FilterCondition,
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
		color: "#FF5733",
		description: "New functionality or enhancement to the application",
		name: "Feature",
	},
	{
		color: "#C70039",
		description: "Issue that causes unexpected behavior or application failure",
		name: "Bug",
	},
	{
		color: "#900C3F",
		description: "Routine maintenance task not affecting production code",
		name: "Chore",
	},
	{
		color: "#581845",
		description: "Code improvement that doesn't change external behavior",
		name: "Refactor",
	},
	{
		color: "#FFC300",
		description: "Improvements or additions to documentation",
		name: "Docs",
	},
	{
		color: "#DAF7A6",
		description: "Adding or modifying test cases and testing infrastructure",
		name: "Test",
	},
	{
		color: "#33FFBD",
		description: "UI/UX improvements or visual design elements",
		name: "Design",
	},
];

export const teamsTable = pgTable(
	"Team",
	{
		cooldownDuration: integer().default(1).notNull(),
		effort: effortType().default("LINEAR").notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		identifier: text().notNull(),
		name: text(),
		sprintDuration: integer().default(2).notNull(),
		sprintStartDate: timestamp({ precision: 3 }).defaultNow().notNull(),
		sprintsEnabled: boolean().default(false).notNull(),
		tasksPerSprint: integer().default(10).notNull(),
		workspaceId: text().notNull(),
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
		author: text(),
		externalId: text().notNull().unique(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		message: text(),
		pullId: text().notNull(),
		repoId: text().notNull(),
		timestamp: timestamp({ precision: 3 }).notNull(),
		url: text().notNull(),
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
		author: text().notNull(),
		body: text(),
		branch: text().notNull(),
		externalId: text().notNull().unique(),
		githubRepoInfoId: text().notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		number: integer().notNull(),
		state: pullRequestState().notNull(),
		timestamp: timestamp({ precision: 3 }).notNull(),
		title: text().notNull(),
		url: text().notNull(),
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
		description: text(),
		externalId: text().notNull().unique(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text().default("").notNull(),
		orgId: text().notNull(),
		private: boolean().default(false).notNull(),
		url: text().notNull(),
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
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		description: text(),
		externalId: text().notNull().unique(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		workspaceId: text().notNull().unique(),
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
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		description: text(),
		endDate: timestamp({ precision: 3 }).notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		startDate: timestamp({ precision: 3 }).notNull(),
		status: sprintStatusType().notNull(),
		teamId: uuid().notNull(),
		updatedAt: timestamp({ precision: 3 })
			.defaultNow()
			.$onUpdateFn(() => new Date())
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
			name: "Sprint_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		uniqueIndex("Sprint_teamId_active_unique")
			.on(table.teamId)
			.where(sql`${table.status} = 'ACTIVE'`),
	],
);

export const notificationsTable = pgTable(
	"Notification",
	{
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		description: text(),
		dismissed: boolean().default(false).notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		read: boolean().default(false).notNull(),
		saved: boolean().default(false).notNull(),
		taskId: uuid().notNull(),
		type: notificationType().notNull(),
		updatedAt: timestamp({ precision: 3 })
			.defaultNow()
			.$onUpdateFn(() => new Date())
			.notNull(),
		userId: text().notNull(),
		workspaceId: text().notNull(),
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
		admins: text().array().default([]).notNull(),
		avatarUrl: text(),
		companySize: integer(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		daysUntilArchive: integer().default(14).notNull(),
		defaultView: text(),
		externalId: text().notNull().unique(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		inviteLinks: jsonb().$type<WorkspaceInviteLink[]>().default([]).notNull(),
		labels: jsonb().$type<Label[]>().default(DEFAULT_LABELS).notNull(),
		name: text().notNull(),
		tasksCreated: integer().default(0).notNull(),
		url: text().notNull(),
	},
	(table) => [
		uniqueIndex("Workspace_url_key").using(
			"btree",
			table.url.asc().nullsLast().op("text_ops"),
		),
		check(
			"daysUntilArchive_check",
			sql`${table.daysUntilArchive} >= 3 AND ${table.daysUntilArchive} <= 30`,
		),
	],
);

export const usersTable = pgTable(
	"User",
	{
		avatarUrl: text(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		defaultWorkspaceId: text(),
		email: text().notNull(),
		externalId: text().unique().notNull(),
		githubUsername: text(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		lastViewedTaskId: uuid(),
		name: text().notNull(),
		onBoarding: boolean().default(true).notNull(),
		savedNotificationIds: uuid().array().default([]).notNull(),
		subscribedTasks: text().array().default([]).notNull(),
		username: text(),
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
		authorId: text().notNull(),
		comment: text().notNull(),
		date: timestamp({ precision: 3 }).defaultNow().notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		taskId: uuid().notNull(),
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
		assigneeId: text(),
		authorId: text().notNull(),
		dateCreated: timestamp({ precision: 3 }).defaultNow().notNull(),
		deleted: boolean().default(false).notNull(),
		description: text(),
		dueDate: timestamp({ precision: 3 }),
		effortEstimate: integer(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		identifier: text().notNull(),
		labels: jsonb().$type<Label[]>().default([]).notNull(),
		order: integer().default(0).notNull(),
		parentId: uuid(),
		priority: priorityType().default("noPriority").notNull(),
		sprintId: uuid(),
		status: statusType().default("backlog").notNull(),
		teamId: uuid().notNull(),
		title: text().notNull(),
		updatedAt: timestamp({ precision: 3 })
			.defaultNow()
			.$onUpdateFn(() => new Date())
			.notNull(),
		workspaceId: text().notNull(),
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
		repoId: uuid().notNull(),
		workspaceId: text().notNull(),
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
		authorId: text().notNull(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		message: text().notNull(),
		taskId: uuid().notNull(),
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
		authorId: text().notNull(),
		description: text().default(""),
		filter: jsonb().$type<FilterCondition[]>().notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		sprintId: uuid(),
		teamId: uuid(),
		type: savedFilterType().notNull(),
		workspaceId: text(),
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
		authorId: text().notNull(),
		content: text().notNull(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		id: uuid().defaultRandom().primaryKey().notNull(),
		likes: text().array().default([]).notNull(),
		sprintId: uuid(),
		type: retrospectiveItemType().default("toImprove").notNull(),
		updatedAt: timestamp({ precision: 3 })
			.defaultNow()
			.$onUpdateFn(() => new Date())
			.notNull(),
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
		userId: text().notNull(),
		workspaceId: text().notNull(),
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
