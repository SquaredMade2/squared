import { sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	boolean,
	foreignKey,
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
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "Team_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const branch = pgTable(
	"Branch",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		taskId: text().notNull(),
		githubRepoInfoId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.taskId],
			foreignColumns: [task.id],
			name: "Branch_taskId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.githubRepoInfoId],
			foreignColumns: [githubRepoInfo.id],
			name: "Branch_githubRepoInfoId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

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

export const sprint = pgTable(
	"Sprint",
	{
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
	},
	(table) => [
		foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "Sprint_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const notification = pgTable(
	"Notification",
	{
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
	},
	(table) => [
		foreignKey({
			columns: [table.taskId],
			foreignColumns: [task.id],
			name: "Notification_taskId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "Notification_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.externalId],
			name: "Notification_userId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

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
		foreignKey({
			columns: [table.defaultWorkspaceId],
			foreignColumns: [workspace.id],
			name: "User_defaultWorkspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.lastViewedTaskId],
			foreignColumns: [task.id],
			name: "User_lastViewedTaskId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		unique("User_externalId_unique").on(table.externalId),
	],
);

export const comment = pgTable(
	"Comment",
	{
		id: text().primaryKey().notNull(),
		comment: text().notNull(),
		date: timestamp({ precision: 3, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		taskId: text().notNull(),
		authorId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.taskId],
			foreignColumns: [task.id],
			name: "Comment_taskId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.externalId],
			name: "Comment_authorId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const task = pgTable(
	"Task",
	{
		id: text().primaryKey().notNull(),
		title: text().notNull(),
		description: text(),
		identifier: text().notNull(),
		dueDate: timestamp({ precision: 3, mode: "string" }),
		effortEstimate: integer(),
		teamId: text().notNull(),
		dateCreated: timestamp({ precision: 3, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		labels: text().array(),
		workspaceId: text().notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		deleted: boolean().default(false).notNull(),
		parentId: text(),
		sprintId: text(),
		status: status().default("backlog").notNull(),
		priority: priority().default("noPriority").notNull(),
		order: integer().default(0).notNull(),
		authorId: text().notNull(),
		assigneeId: text(),
	},
	(table) => [
		uniqueIndex("Task_teamId_identifier_key").using(
			"btree",
			table.teamId.asc().nullsLast().op("text_ops"),
			table.identifier.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("Task_workspaceId_identifier_key").using(
			"btree",
			table.workspaceId.asc().nullsLast().op("text_ops"),
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
			foreignColumns: [team.id],
			name: "Task_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "Task_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.sprintId],
			foreignColumns: [sprint.id],
			name: "Task_sprintId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.externalId],
			name: "Task_authorId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.assigneeId],
			foreignColumns: [user.externalId],
			name: "Task_assigneeId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
	],
);

export const label = pgTable(
	"Label",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		description: text(),
		color: text().notNull(),
		workspaceId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "Label_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

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
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "UniversalTokenLink_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
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
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "WorkspaceRepositories_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.repoId],
			foreignColumns: [githubRepoInfo.id],
			name: "WorkspaceRepositories_repoId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const project = pgTable(
	"Project",
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		teamId: text(),
		workspaceId: text(),
	},
	(table) => [
		foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "Project_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "Project_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const commit = pgTable(
	"Commit",
	{
		id: text().primaryKey().notNull(),
		message: text().notNull(),
		url: text().notNull(),
		authorName: text(),
		repoName: text(),
		owner: text(),
		branchId: text().notNull(),
		taskId: text(),
		timestamp: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.branchId],
			foreignColumns: [branch.id],
			name: "Commit_branchId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.taskId],
			foreignColumns: [task.id],
			name: "Commit_taskId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
	],
);

export const taskEvent = pgTable(
	"TaskEvent",
	{
		id: text().primaryKey().notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		taskId: text().notNull(),
		message: text().notNull(),
		authorId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.taskId],
			foreignColumns: [task.id],
			name: "TaskEvent_taskId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.externalId],
			name: "TaskEvent_authorId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

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
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "SavedFilter_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "SavedFilter_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.externalId],
			name: "SavedFilter_authorId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const retrospectiveItem = pgTable(
	"RetrospectiveItem",
	{
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
	},
	(table) => [
		foreignKey({
			columns: [table.wentWellSprintId],
			foreignColumns: [sprint.id],
			name: "RetrospectiveItem_wentWellSprintId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.toImproveSprintId],
			foreignColumns: [sprint.id],
			name: "RetrospectiveItem_toImproveSprintId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.actionItemsSprintId],
			foreignColumns: [sprint.id],
			name: "RetrospectiveItem_actionItemsSprintId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("set null"),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.externalId],
			name: "RetrospectiveItem_authorId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
	],
);

export const blockedTasks = pgTable(
	"_BlockedTasks",
	{
		a: text("A").notNull(),
		b: text("B").notNull(),
	},
	(table) => [
		index().using("btree", table.b.asc().nullsLast().op("text_ops")),
		foreignKey({
			columns: [table.a],
			foreignColumns: [task.id],
			name: "_BlockedTasks_A_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.b],
			foreignColumns: [task.id],
			name: "_BlockedTasks_B_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
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
		foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "UserWorkspace_workspaceId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.externalId],
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

export const userTeam = pgTable(
	"UserTeam",
	{
		teamId: text().notNull(),
		userId: text().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "UserTeam_teamId_fkey",
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.externalId],
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
