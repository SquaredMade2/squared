import { sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

export const activityType = pgEnum("ActivityType", ["TASK_EVENT", "COMMIT"]);
export const effort = pgEnum("Effort", ["LINEAR", "FIBONACCI", "EXPONENTIAL"]);
export const notificationType = pgEnum("NotificationType", [
	"ASSIGNED",
	"PARTICIPATING",
	"MENTIONED",
	"CREATED",
]);
export const priority = pgEnum("Priority", [
	"noPriority",
	"urgent",
	"high",
	"medium",
	"low",
]);
export const retrospectiveItemType = pgEnum("RetrospectiveItemType", [
	"wentWell",
	"toImprove",
	"actionItems",
]);
export const savedFilterType = pgEnum("SavedFilterType", ["TEAM", "WORKSPACE"]);
export const sprintStatus = pgEnum("SprintStatus", [
	"PLANNED",
	"ACTIVE",
	"COMPLETED",
]);
export const status = pgEnum("Status", [
	"backlog",
	"todo",
	"inProgress",
	"inReview",
	"done",
	"canceled",
	"archived",
]);

export const teamsTable = pgTable(
	"Team",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text(),
		identifier: text().notNull(),
		workspaceId: text().notNull(),
		sprintsEnabled: boolean().default(false).notNull(),
		sprintDuration: integer().default(2).notNull(),
		cooldownDuration: integer().default(1).notNull(),
		sprintStartDate: timestamp({ precision: 3 })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		tasksPerSprint: integer().default(10).notNull(),
		effort: effort().default("LINEAR").notNull(),
	},
	(table) => [
		uniqueIndex("Team_workspaceId_identifier_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("text_ops"),
			table.identifier.asc().nullsLast().op("text_ops"),
		),
	],
);

export const branchesTable = pgTable("Branch", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	taskId: text().notNull(),
	githubRepoInfoId: text().notNull(),
});

export const githubRepoInfoTable = pgTable(
	"GithubRepoInfo",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		repoName: text().notNull(),
		owner: text().notNull(),
	},
	(table) => [
		uniqueIndex("GithubRepoInfo_repoName_key").using(
			"btree",
			table.repoName.asc().nullsLast().op("text_ops"),
		),
	],
);

export const sprintsTable = pgTable("Sprint", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	startDate: timestamp({ precision: 3 }).notNull(),
	endDate: timestamp({ precision: 3 }).notNull(),
	status: sprintStatus().notNull(),
	teamId: text().notNull(),
	createdAt: timestamp({ precision: 3 })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp({ precision: 3 }).notNull(),
	description: text(),
});

export const notificationsTable = pgTable("Notification", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	taskId: text().notNull(),
	read: boolean().default(false).notNull(),
	saved: boolean().default(false).notNull(),
	description: text(),
	createdAt: timestamp({ precision: 3 })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp({ precision: 3 })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	workspaceId: text().notNull(),
	dismissed: boolean().default(false).notNull(),
	type: notificationType().notNull(),
	userId: text().notNull(),
});

export const workspacesTable = pgTable(
	"Workspace",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		url: text().notNull(),
		companySize: integer(),
		tasksCreated: integer().default(0).notNull(),
		universalTokenLinkId: text(),
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

export const usersTable = pgTable(
	"User",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		username: text(),
		email: text().notNull(),
		lastLogin: timestamp({ precision: 3 })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		onBoarding: boolean().default(true).notNull(),
		defaultWorkspaceId: text(),
		avatarUrl: text(),
		savedNotificationIds: text().array().default([]).notNull(),
		subscribedTasks: text().array().default([]).notNull(),
		githubUsername: text(),
		createdAt: timestamp({ precision: 3 })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		lastViewedTaskId: text(),
		externalId: text().notNull(),
	},
	(table) => [
		uniqueIndex("User_email_key").using(
			"btree",
			table.email.asc().nullsLast().op("text_ops"),
		),
		unique("User_externalId_unique").on(table.externalId),
	],
);

export const commentsTable = pgTable("Comment", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	comment: text().notNull(),
	date: timestamp({ precision: 3 }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	taskId: text().notNull(),
	authorId: text().notNull(),
});

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
		teamId: text("team_id").notNull(),
		dateCreated: timestamp("date_created").defaultNow().notNull(),
		assigneeId: text("assignee_id"),
		labels: text("labels").array().default([]).notNull(),
		workspaceId: text("workspace_id").notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		deleted: boolean("deleted").default(false).notNull(),
		parentId: text("parent_id"),
		sprintId: text("sprint_id"),
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
	],
);

export const labelsTable = pgTable("Label", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	color: text().notNull(),
	workspaceId: text().notNull(),
});

export const universalTokenLinksTable = pgTable(
	"UniversalTokenLink",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		token: text().default("").notNull(),
		isEnabled: boolean().default(true).notNull(),
		workspaceId: text().notNull(),
	},
	(table) => [
		uniqueIndex("UniversalTokenLink_workspaceId_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("text_ops"),
		),
	],
);

export const workspaceRepositoriesTable = pgTable(
	"WorkspaceRepositories",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		workspaceId: text().notNull(),
		repoId: text().notNull(),
	},
	(table) => [
		uniqueIndex("WorkspaceRepositories_workspaceId_repoId_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("text_ops"),
			table.repoId.asc().nullsLast().op("text_ops"),
		),
	],
);

export const projectsTable = pgTable("Project", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	teamId: text(),
	workspaceId: text(),
});

export const commitsTable = pgTable("Commit", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	message: text().notNull(),
	url: text().notNull(),
	authorName: text(),
	repoName: text(),
	owner: text(),
	branchId: text().notNull(),
	taskId: text(),
	timestamp: timestamp({ precision: 3 }).notNull(),
});

export const taskEventsTable = pgTable("TaskEvent", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3 })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	taskId: text().notNull(),
	message: text().notNull(),
	authorId: text().notNull(),
});

export const savedFiltersTable = pgTable(
	"SavedFilter",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text().notNull(),
		description: text().default(""),
		filter: jsonb().array(),
		workspaceId: text(),
		teamId: text(),
		type: savedFilterType().notNull(),
		sprintId: text(),
		authorId: text().notNull(),
	},
	(table) => [
		index("teamIdx").using(
			"btree",
			table.teamId.asc().nullsLast().op("text_ops"),
		),
		index("workspaceIdx").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("text_ops"),
		),
	],
);

export const retrospectiveItemsTable = pgTable("RetrospectiveItem", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	content: text().notNull(),
	wentWellSprintId: text(),
	toImproveSprintId: text(),
	actionItemsSprintId: text(),
	createdAt: timestamp({ precision: 3 })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp({ precision: 3 }).notNull(),
	type: retrospectiveItemType().default("toImprove").notNull(),
	likes: text().array().default([]),
	authorId: text().notNull(),
});

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

export const userWorkspacesTable = pgTable(
	"UserWorkspace",
	{
		workspaceId: text().notNull(),
		userId: text().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.workspaceId, table.userId],
			name: "UserWorkspace_pkey",
		}),
	],
);

export const userTeamsTable = pgTable(
	"UserTeam",
	{
		teamId: text().notNull(),
		userId: text().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.teamId, table.userId],
			name: "UserTeam_pkey",
		}),
	],
);

function objEnum<T extends string>(enumValues: readonly T[]) {
	const enumObject = {} as { [K in T]: K };
	for (const enumValue of enumValues) {
		enumObject[enumValue] = enumValue;
	}
	return enumObject;
}

export const Activity = objEnum(activityType.enumValues);
export type Activity = (typeof activityType.enumValues)[number];
export const Effort = objEnum(effort.enumValues);
export type Effort = (typeof effort.enumValues)[number];
export const NotificationType = objEnum(notificationType.enumValues);
export type NotificationType = (typeof notificationType.enumValues)[number];
export const Priority = objEnum(priority.enumValues);
export type Priority = (typeof priority.enumValues)[number];
export const RetrospectiveItemType = objEnum(retrospectiveItemType.enumValues);
export type RetrospectiveItemType =
	(typeof retrospectiveItemType.enumValues)[number];
export const SavedFilterType = objEnum(savedFilterType.enumValues);
export type SavedFilterType = (typeof savedFilterType.enumValues)[number];
export const SprintStatus = objEnum(sprintStatus.enumValues);
export type SprintStatus = (typeof sprintStatus.enumValues)[number];
export const Status = objEnum(status.enumValues);
export type Status = (typeof status.enumValues)[number];
export type Team = typeof teamsTable.$inferSelect;
export type Branch = typeof branchesTable.$inferSelect;
export type GithubRepoInfo = typeof githubRepoInfoTable.$inferSelect;
export type Sprint = typeof sprintsTable.$inferSelect;
export type Notification = typeof notificationsTable.$inferSelect;
export type Workspace = typeof workspacesTable.$inferSelect;
export type WorkspaceLabel = Workspace & { labels: Label[] };
export type User = typeof usersTable.$inferSelect;
export type Comment = typeof commentsTable.$inferSelect;
export type Task = typeof tasksTable.$inferSelect;
export type Label = typeof labelsTable.$inferSelect;
export type UniversalTokenLink = typeof universalTokenLinksTable.$inferSelect;
export type WorkspaceRepositories =
	typeof workspaceRepositoriesTable.$inferSelect;
export type Project = typeof projectsTable.$inferSelect;
export type Commit = typeof commitsTable.$inferSelect;
export type TaskEvent = typeof taskEventsTable.$inferSelect;
export type SavedFilter = typeof savedFiltersTable.$inferSelect;
export type RetrospectiveItem = typeof retrospectiveItemsTable.$inferSelect;
export type BlockedTasks = typeof blockedTasksTable.$inferSelect;
export type UserWorkspace = typeof userWorkspacesTable.$inferSelect;
export type UserTeam = typeof userTeamsTable.$inferSelect;
