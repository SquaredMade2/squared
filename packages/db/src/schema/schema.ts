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
	effort,
	notificationType,
	priority,
	retrospectiveItemType,
	savedFilterType,
	sprintStatus,
	status,
} from "./types";

export const blockedTasksTable = pgTable(
	"_BlockedTasks",
	{
		a: text("A").notNull(),
		b: text("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("text_ops")),
		primaryKey({ columns: [table.a, table.b], name: "_BlockedTasks_AB_pkey" }),
	],
);

export const branchesTable = pgTable(
	"Branch",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		taskId: uuid().notNull(),
		githubRepoInfoId: uuid().notNull(),
	},
	(table) => [
		foreignKey({
			name: "Branch_githubRepoInfoId_fkey",
			columns: [table.githubRepoInfoId],
			foreignColumns: [githubRepoInfoTable.id],
		}),
		foreignKey({
			name: "Branch_taskId_fkey",
			columns: [table.taskId],
			foreignColumns: [tasksTable.id],
		}),
	],
);

export const commentsTable = pgTable(
	"Comment",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		comment: text().notNull(),
		date: timestamp({ precision: 3 }).defaultNow().notNull(),
		taskId: uuid().notNull(),
		authorId: text().notNull(),
	},
	(table) => [
		foreignKey({
			name: "Comment_taskId_fkey",
			columns: [table.taskId],
			foreignColumns: [tasksTable.id],
		}),
		foreignKey({
			name: "Comment_authorId_fkey",
			columns: [table.authorId],
			foreignColumns: [usersTable.externalId],
		}),
	],
);

export const commitsTable = pgTable(
	"Commit",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		message: text().notNull(),
		url: text().notNull(),
		authorName: text(),
		repoName: text(),
		owner: text(),
		branchId: uuid().notNull(),
		taskId: uuid(),
		timestamp: timestamp({ precision: 3 }).notNull(),
	},
	(table) => [
		foreignKey({
			name: "Commit_branchId_fkey",
			columns: [table.branchId],
			foreignColumns: [branchesTable.id],
		}),
		foreignKey({
			name: "Commit_taskId_fkey",
			columns: [table.taskId],
			foreignColumns: [tasksTable.id],
		}),
	],
);

export const githubRepoInfoTable = pgTable("GithubRepoInfo", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	repoName: text().unique().notNull(),
	owner: text().notNull(),
});

export const labelsTable = pgTable(
	"Label",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		description: text(),
		color: text().notNull(),
		workspaceId: uuid().notNull(),
	},
	(table) => [
		foreignKey({
			name: "Label_workspaceId_fkey",
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.id],
		}),
	],
);

export const notificationsTable = pgTable(
	"Notification",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		taskId: uuid().notNull(),
		read: boolean().default(false).notNull(),
		saved: boolean().default(false).notNull(),
		description: text(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		updatedAt: timestamp({ precision: 3 })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		workspaceId: uuid().notNull(),
		dismissed: boolean().default(false).notNull(),
		type: notificationType().notNull(),
		userId: text().notNull(),
	},
	(table) => [
		foreignKey({
			name: "Notification_taskId_fkey",
			columns: [table.taskId],
			foreignColumns: [tasksTable.id],
		}),
		foreignKey({
			name: "Notification_userId_fkey",
			columns: [table.userId],
			foreignColumns: [usersTable.externalId],
		}),
		foreignKey({
			name: "Notification_workspaceId_fkey",
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.id],
		}),
	],
);

export const projectsTable = pgTable(
	"Project",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		teamId: uuid(),
		workspaceId: uuid(),
	},
	(table) => [
		foreignKey({
			name: "Project_teamId_fkey",
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
		}),
		foreignKey({
			name: "Project_workspaceId_fkey",
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.id],
		}),
	],
);

export const retrospectiveItemsTable = pgTable(
	"RetrospectiveItem",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		content: text().notNull(),
		wentWellSprintId: uuid(),
		toImproveSprintId: uuid(),
		actionItemsSprintId: uuid(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		updatedAt: timestamp({ precision: 3 })
			.$onUpdate(() => new Date())
			.notNull(),
		type: retrospectiveItemType().default("toImprove").notNull(),
		likes: text().array().default([]).notNull(),
		authorId: text().notNull(),
	},
	(table) => [
		index("wentWellSprintIdIdx").using(
			"btree",
			table.wentWellSprintId.asc().nullsLast().op("uuid_ops"),
		),
		index("toImproveSprintIdIdx").using(
			"btree",
			table.toImproveSprintId.asc().nullsLast().op("uuid_ops"),
		),
		index("actionItemsSprintIdIdx").using(
			"btree",
			table.actionItemsSprintId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			name: "RetrospectiveItem_authorId_fkey",
			columns: [table.authorId],
			foreignColumns: [usersTable.externalId],
		}),
		foreignKey({
			name: "RetrospectiveItem_sprintId_fkey",
			columns: [
				table.wentWellSprintId,
				table.toImproveSprintId,
				table.actionItemsSprintId,
			],
			foreignColumns: [sprintsTable.id, sprintsTable.id, sprintsTable.id],
		}),
	],
);

export const savedFiltersTable = pgTable(
	"SavedFilter",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		description: text().default(""),
		filter: jsonb().$type<FilterCondition[]>().notNull(),
		workspaceId: uuid(),
		teamId: uuid(),
		type: savedFilterType().notNull(),
		sprintId: uuid(),
		authorId: text().notNull(),
	},
	(table) => [
		foreignKey({
			name: "SavedFilter_workspaceId_fkey",
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.id],
		}),
		foreignKey({
			name: "SavedFilter_teamId_fkey",
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
		}),
		foreignKey({
			name: "SavedFilter_sprintId_fkey",
			columns: [table.sprintId],
			foreignColumns: [sprintsTable.id],
		}),
		foreignKey({
			name: "SavedFilter_authorId_fkey",
			columns: [table.authorId],
			foreignColumns: [usersTable.externalId],
		}),
	],
);

export const sprintsTable = pgTable(
	"Sprint",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		startDate: timestamp({ precision: 3 }).defaultNow().notNull(),
		endDate: timestamp({ precision: 3 }).notNull(),
		status: sprintStatus().notNull(),
		teamId: uuid().notNull(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		updatedAt: timestamp({ precision: 3 })
			.$onUpdate(() => new Date())
			.defaultNow()
			.notNull(),
		description: text(),
	},
	(table) => [
		uniqueIndex("team_name_idx").on(table.teamId, table.name),
		foreignKey({
			name: "sprints_team_id_fkey",
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
		}),
	],
);

export const tasksTable = pgTable(
	"tasks",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		authorId: text("author_id").notNull(),
		title: text("title").notNull(),
		description: text("description"),
		identifier: text("identifier").notNull(),
		dueDate: timestamp("due_date"),
		effortEstimate: integer("effort_estimate"),
		teamId: uuid("team_id").notNull(),
		dateCreated: timestamp("date_created").defaultNow().notNull(),
		assigneeId: text("assignee_id"),
		labels: text("labels").array().default([]).notNull(),
		workspaceId: uuid("workspace_id").notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		deleted: boolean("deleted").default(false).notNull(),
		parentId: uuid("parent_id"),
		sprintId: uuid("sprint_id"),
		order: integer("order").default(0).notNull(),
		status: status("status").default("backlog").notNull(),
		priority: priority("priority").default("noPriority").notNull(),
	},
	(table) => [
		uniqueIndex("workspace_identifier_idx").on(
			table.workspaceId,
			table.identifier,
		),
		uniqueIndex("team_identifier_idx").on(table.teamId, table.identifier),
		foreignKey({
			name: "tasks_team_id_fkey",
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
		}),
		foreignKey({
			name: "tasks_workspace_id_fkey",
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.id],
		}),
		foreignKey({
			name: "tasks_author_id_fkey",
			columns: [table.authorId],
			foreignColumns: [usersTable.externalId],
		}),
		foreignKey({
			name: "tasks_assignee_id_fkey",
			columns: [table.assigneeId],
			foreignColumns: [usersTable.externalId],
		}),
		foreignKey({
			name: "tasks_parent_id_fkey",
			columns: [table.parentId],
			foreignColumns: [table.id],
		}),
		foreignKey({
			name: "tasks_sprint_id_fkey",
			columns: [table.sprintId],
			foreignColumns: [sprintsTable.id],
		}),
	],
);

export const taskEventsTable = pgTable(
	"TaskEvent",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		taskId: uuid().notNull(),
		message: text().notNull(),
		authorId: text().notNull(),
	},
	(table) => [
		foreignKey({
			name: "TaskEvent_taskId_fkey",
			columns: [table.taskId],
			foreignColumns: [tasksTable.id],
		}),
		foreignKey({
			name: "TaskEvent_authorId_fkey",
			columns: [table.authorId],
			foreignColumns: [usersTable.externalId],
		}),
	],
);

export const teamsTable = pgTable(
	"Team",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text(),
		identifier: text().notNull(),
		workspaceId: uuid().notNull(),
		sprintsEnabled: boolean().default(false).notNull(),
		sprintDuration: integer().default(2).notNull(),
		cooldownDuration: integer().default(1).notNull(),
		sprintStartDate: timestamp({ precision: 3 }).defaultNow().notNull(),
		tasksPerSprint: integer().default(10).notNull(),
		effort: effort().default("LINEAR").notNull(),
	},
	(table) => [
		uniqueIndex("Team_workspaceId_identifier_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("uuid_ops"),
			table.identifier.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			name: "Team_workspaceId_fkey",
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.id],
		}),
	],
);

export const universalTokenLinksTable = pgTable(
	"UniversalTokenLink",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		token: text().default("").notNull(),
		isEnabled: boolean().default(true).notNull(),
		workspaceId: uuid().unique().notNull(),
	},
	(table) => [
		uniqueIndex("UniversalTokenLink_workspaceId_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			name: "UniversalTokenLink_workspaceId_fkey",
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.id],
		}),
	],
);

export const usersTable = pgTable(
	"User",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		externalId: text().unique().notNull(),
		name: text().notNull(),
		username: text(),
		email: text().unique().notNull(),
		lastLogin: timestamp({ precision: 3 }).defaultNow().notNull(),
		onBoarding: boolean().default(true).notNull(),
		defaultWorkspaceId: uuid(),
		avatarUrl: text(),
		savedNotificationIds: text().array().default([]).notNull(),
		subscribedTasks: text().array().default([]).notNull(),
		githubUsername: text(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		lastViewedTaskId: uuid(),
	},
	(table) => [
		uniqueIndex("User_externalId_key").using(
			"btree",
			table.externalId.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("User_email_key").using(
			"btree",
			table.email.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("User_defaultWorkspaceId_key").using(
			"btree",
			table.defaultWorkspaceId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			name: "User_defaultWorkspaceId_fkey",
			columns: [table.defaultWorkspaceId],
			foreignColumns: [workspacesTable.id],
		}),
		index("lastViewedTaskIdIdx").using(
			"btree",
			table.lastViewedTaskId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const userTeamsTable = pgTable(
	"UserTeam",
	{
		teamId: uuid().notNull(),
		userId: text().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.teamId, table.userId],
			name: "UserTeam_pkey",
		}),
		foreignKey({
			name: "UserTeam_teamId_fkey",
			columns: [table.teamId],
			foreignColumns: [teamsTable.id],
		}),
		foreignKey({
			name: "UserTeam_userId_fkey",
			columns: [table.userId],
			foreignColumns: [usersTable.externalId],
		}),
	],
);

export const userWorkspacesTable = pgTable(
	"UserWorkspace",
	{
		workspaceId: uuid().notNull(),
		userId: text().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.workspaceId, table.userId],
			name: "UserWorkspace_pkey",
		}),
		uniqueIndex("UserWorkspace_workspaceId_userId_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("uuid_ops"),
			table.userId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			name: "UserWorkspace_workspaceId_fkey",
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.id],
		}),
		foreignKey({
			name: "UserWorkspace_userId_fkey",
			columns: [table.userId],
			foreignColumns: [usersTable.externalId],
		}),
	],
);

export const workspaceRepositoriesTable = pgTable(
	"WorkspaceRepositories",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		workspaceId: uuid().notNull(),
		repoId: uuid().notNull(),
	},
	(table) => [
		uniqueIndex("WorkspaceRepositories_workspaceId_repoId_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("uuid_ops"),
			table.repoId.asc().nullsLast().op("uuid_ops"),
		),
		foreignKey({
			name: "WorkspaceRepositories_workspaceId_fkey",
			columns: [table.workspaceId],
			foreignColumns: [workspacesTable.id],
		}),
		foreignKey({
			name: "WorkspaceRepositories_repoId_fkey",
			columns: [table.repoId],
			foreignColumns: [githubRepoInfoTable.id],
		}),
	],
);

export const workspacesTable = pgTable(
	"Workspace",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		url: text().unique().notNull(),
		companySize: integer(),
		createdAt: timestamp({ precision: 3 }).defaultNow().notNull(),
		tasksCreated: integer().default(0).notNull(),
		universalTokenLinkId: uuid(),
		avatarUrl: text(),
		admins: text().array().default([]).notNull(),
		defaultView: text(),
	},
	(table) => [
		uniqueIndex("Workspace_url_key").using(
			"btree",
			table.url.asc().nullsLast().op("text_ops"),
		),
	],
);

export type BlockedTasks = typeof blockedTasksTable.$inferSelect;
export type Branch = typeof branchesTable.$inferSelect;
export type Comment = typeof commentsTable.$inferSelect;
export type Commit = typeof commitsTable.$inferSelect;
export type GithubRepoInfo = typeof githubRepoInfoTable.$inferSelect;
export type Label = typeof labelsTable.$inferSelect;
export type Notification = typeof notificationsTable.$inferSelect;
export type Project = typeof projectsTable.$inferSelect;
export type RetrospectiveItem = typeof retrospectiveItemsTable.$inferSelect;
export type SavedFilter = typeof savedFiltersTable.$inferSelect;
export type Sprint = typeof sprintsTable.$inferSelect;
export type Task = typeof tasksTable.$inferSelect;
export type TaskEvent = typeof taskEventsTable.$inferSelect;
export type Team = typeof teamsTable.$inferSelect;
export type UniversalTokenLink = typeof universalTokenLinksTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;
export type UserTeam = typeof userTeamsTable.$inferSelect;
export type UserWorkspace = typeof userWorkspacesTable.$inferSelect;
export type Workspace = typeof workspacesTable.$inferSelect;
export type WorkspaceLabel = Workspace & { labels: Label[] };
export type WorkspaceRepositories =
	typeof workspaceRepositoriesTable.$inferSelect;
