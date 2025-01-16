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
	varchar,
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

export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: "string" }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", {
		withTimezone: true,
		mode: "string",
	}),
	startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
		.defaultNow()
		.notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const team = pgTable(
	"Team",
	{
		id: text().primaryKey().notNull(),
		name: text(),
		identifier: text().notNull(),
		workspaceId: text().notNull(),
		sprintsEnabled: boolean().default(false).notNull(),
		sprintDuration: integer().default(2).notNull(),
		cooldownDuration: integer().default(1).notNull(),
		sprintStartDate: timestamp({ precision: 3, mode: "string" })
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

export const branch = pgTable("Branch", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	taskId: text().notNull(),
	githubRepoInfoId: text().notNull(),
});

export const githubRepoInfo = pgTable(
	"GithubRepoInfo",
	{
		id: text().primaryKey().notNull(),
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

export const sprint = pgTable("Sprint", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	startDate: timestamp({ precision: 3, mode: "string" }).notNull(),
	endDate: timestamp({ precision: 3, mode: "string" }).notNull(),
	status: sprintStatus().notNull(),
	teamId: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: "string" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	description: text(),
});

export const notification = pgTable("Notification", {
	id: text().primaryKey().notNull(),
	taskId: text().notNull(),
	read: boolean().default(false).notNull(),
	saved: boolean().default(false).notNull(),
	description: text(),
	createdAt: timestamp({ precision: 3, mode: "string" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp({ precision: 3, mode: "string" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	workspaceId: text().notNull(),
	dismissed: boolean().default(false).notNull(),
	type: notificationType().notNull(),
	userId: text().notNull(),
});

export const workspace = pgTable(
	"Workspace",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		url: text().notNull(),
		companySize: integer(),
		tasksCreated: integer().default(0).notNull(),
		universalTokenLinkId: text(),
		avatarUrl: text(),
		admins: text().array(),
		defaultView: text(),
	},
	(table) => [
		uniqueIndex("Workspace_url_key").using(
			"btree",
			table.url.asc().nullsLast().op("text_ops"),
		),
	],
);

export const user = pgTable(
	"User",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		username: text(),
		email: text().notNull(),
		lastLogin: timestamp({ precision: 3, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		onBoarding: boolean().default(true).notNull(),
		defaultWorkspaceId: text(),
		avatarUrl: text(),
		savedNotificationIds: text().array().default(["RAY"]),
		subscribedTasks: text().array().default(["RAY"]),
		githubUsername: text(),
		createdAt: timestamp({ precision: 3, mode: "string" })
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

export const comment = pgTable("Comment", {
	id: text().primaryKey().notNull(),
	comment: text().notNull(),
	date: timestamp({ precision: 3, mode: "string" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	taskId: text().notNull(),
	authorId: text().notNull(),
});

export const task = pgTable(
	"tasks",
	{
		id: text("id").primaryKey(),
		authorId: text("author_id").notNull(),
		title: text("title").notNull(),
		description: text("description"),
		identifier: text("identifier").notNull(),
		dueDate: timestamp("due_date"),
		effortEstimate: integer("effort_estimate"),
		teamId: text("team_id").notNull(),
		dateCreated: timestamp("date_created").defaultNow().notNull(),
		assigneeId: text("assignee_id"),
		labels: text("labels").array(),
		workspaceId: text("workspace_id").notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		deleted: boolean("deleted").default(false).notNull(),
		parentId: text("parent_id"),
		sprintId: text("sprint_id"),
		order: integer("order").default(0).notNull(),
	},
	(table) => ({
		workspaceIdentifierIdx: uniqueIndex("workspace_identifier_idx").on(
			table.workspaceId,
			table.identifier,
		),
		teamIdentifierIdx: uniqueIndex("team_identifier_idx").on(
			table.teamId,
			table.identifier,
		),
	}),
);

export const label = pgTable("Label", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	color: text().notNull(),
	workspaceId: text().notNull(),
});

export const universalTokenLink = pgTable(
	"UniversalTokenLink",
	{
		id: text().primaryKey().notNull(),
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

export const workspaceRepositories = pgTable(
	"WorkspaceRepositories",
	{
		id: text().primaryKey().notNull(),
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

export const project = pgTable("Project", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	teamId: text(),
	workspaceId: text(),
});

export const commit = pgTable("Commit", {
	id: text().primaryKey().notNull(),
	message: text().notNull(),
	url: text().notNull(),
	authorName: text(),
	repoName: text(),
	owner: text(),
	branchId: text().notNull(),
	taskId: text(),
	timestamp: timestamp({ precision: 3, mode: "string" }).notNull(),
});

export const taskEvent = pgTable("TaskEvent", {
	id: text().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: "string" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	taskId: text().notNull(),
	message: text().notNull(),
	authorId: text().notNull(),
});

export const savedFilter = pgTable(
	"SavedFilter",
	{
		id: text().primaryKey().notNull(),
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

export const retrospectiveItem = pgTable("RetrospectiveItem", {
	id: text().primaryKey().notNull(),
	content: text().notNull(),
	wentWellSprintId: text(),
	toImproveSprintId: text(),
	actionItemsSprintId: text(),
	createdAt: timestamp({ precision: 3, mode: "string" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	type: retrospectiveItemType().default("toImprove").notNull(),
	likes: text().array().default(["RAY"]),
	authorId: text().notNull(),
});

export const blockedTasks = pgTable(
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

export const userWorkspace = pgTable(
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

export const userTeam = pgTable(
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
