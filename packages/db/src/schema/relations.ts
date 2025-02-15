import { relations } from "drizzle-orm/relations";
import {
	blockedTasksTable,
	commentsTable,
	commitsTable,
	githubPullRequestTaskTable,
	githubPullRequestsTable,
	githubRepoInfoTable,
	notificationsTable,
	projectsTable,
	retrospectiveItemsTable,
	savedFiltersTable,
	sprintsTable,
	taskEventsTable,
	tasksTable,
	teamsTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspaceRepositoriesTable,
	workspacesTable,
} from "./schema";

export const teamRelations = relations(teamsTable, ({ one, many }) => ({
	workspace: one(workspacesTable, {
		fields: [teamsTable.workspaceId],
		references: [workspacesTable.externalId],
	}),
	sprints: many(sprintsTable),
	tasks: many(tasksTable),
	projects: many(projectsTable),
	savedFilters: many(savedFiltersTable),
	userTeams: many(userTeamsTable),
}));

export const workspaceRelations = relations(workspacesTable, ({ many }) => ({
	teams: many(teamsTable),
	notifications: many(notificationsTable),
	users: many(usersTable),
	tasks: many(tasksTable),
	workspaceRepositories: many(workspaceRepositoriesTable),
	projects: many(projectsTable),
	savedFilters: many(savedFiltersTable),
	userWorkspaces: many(userWorkspacesTable),
}));

export const githubPullRequestRelations = relations(
	githubPullRequestsTable,
	({ one, many }) => ({
		githubPullRequestTasks: many(githubPullRequestTaskTable),
		githubRepoInfo: one(githubRepoInfoTable, {
			fields: [githubPullRequestsTable.githubRepoInfoId],
			references: [githubRepoInfoTable.externalId],
		}),
		commits: many(commitsTable),
	}),
);

export const taskRelations = relations(tasksTable, ({ one, many }) => ({
	githubPullRequestTasks: many(githubPullRequestTaskTable),
	notifications: many(notificationsTable),
	users: many(usersTable, {
		relationName: "user_lastViewedTaskId_task_id",
	}),
	comments: many(commentsTable),
	task: one(tasksTable, {
		fields: [tasksTable.parentId],
		references: [tasksTable.id],
		relationName: "task_parentId_task_id",
	}),
	tasks: many(tasksTable, {
		relationName: "task_parentId_task_id",
	}),
	team: one(teamsTable, {
		fields: [tasksTable.teamId],
		references: [teamsTable.id],
	}),
	workspace: one(workspacesTable, {
		fields: [tasksTable.workspaceId],
		references: [workspacesTable.externalId],
	}),
	sprint: one(sprintsTable, {
		fields: [tasksTable.sprintId],
		references: [sprintsTable.id],
	}),
	user_authorId: one(usersTable, {
		fields: [tasksTable.authorId],
		references: [usersTable.externalId],
		relationName: "task_authorId_user_externalId",
	}),
	user_assigneeId: one(usersTable, {
		fields: [tasksTable.assigneeId],
		references: [usersTable.externalId],
		relationName: "task_assigneeId_user_externalId",
	}),
	taskEvents: many(taskEventsTable),
	blockedTasks_a: many(blockedTasksTable, {
		relationName: "blockedTasks_a_task_id",
	}),
	blockedTasks_b: many(blockedTasksTable, {
		relationName: "blockedTasks_b_task_id",
	}),
}));

export const githubRepoInfoRelations = relations(
	githubRepoInfoTable,
	({ many }) => ({
		pullRequests: many(githubPullRequestsTable),
		workspaceRepositories: many(workspaceRepositoriesTable),
	}),
);

export const sprintRelations = relations(sprintsTable, ({ one, many }) => ({
	team: one(teamsTable, {
		fields: [sprintsTable.teamId],
		references: [teamsTable.id],
	}),
	tasks: many(tasksTable),
	retrospectiveItems_wentWellSprintId: many(retrospectiveItemsTable, {
		relationName: "retrospectiveItem_wentWellSprintId_sprint_id",
	}),
	retrospectiveItems_toImproveSprintId: many(retrospectiveItemsTable, {
		relationName: "retrospectiveItem_toImproveSprintId_sprint_id",
	}),
	retrospectiveItems_actionItemsSprintId: many(retrospectiveItemsTable, {
		relationName: "retrospectiveItem_actionItemsSprintId_sprint_id",
	}),
}));

export const notificationRelations = relations(
	notificationsTable,
	({ one }) => ({
		task: one(tasksTable, {
			fields: [notificationsTable.taskId],
			references: [tasksTable.id],
		}),
		workspace: one(workspacesTable, {
			fields: [notificationsTable.workspaceId],
			references: [workspacesTable.externalId],
		}),
		user: one(usersTable, {
			fields: [notificationsTable.userId],
			references: [usersTable.externalId],
		}),
	}),
);

export const userRelations = relations(usersTable, ({ one, many }) => ({
	notifications: many(notificationsTable),
	workspace: one(workspacesTable, {
		fields: [usersTable.defaultWorkspaceId],
		references: [workspacesTable.externalId],
	}),
	task: one(tasksTable, {
		fields: [usersTable.lastViewedTaskId],
		references: [tasksTable.id],
		relationName: "user_lastViewedTaskId_task_id",
	}),
	comments: many(commentsTable),
	tasks_authorId: many(tasksTable, {
		relationName: "task_authorId_user_externalId",
	}),
	tasks_assigneeId: many(tasksTable, {
		relationName: "task_assigneeId_user_externalId",
	}),
	taskEvents: many(taskEventsTable),
	savedFilters: many(savedFiltersTable),
	retrospectiveItems: many(retrospectiveItemsTable),
	userWorkspaces: many(userWorkspacesTable),
	userTeams: many(userTeamsTable),
}));

export const commentRelations = relations(commentsTable, ({ one }) => ({
	task: one(tasksTable, {
		fields: [commentsTable.taskId],
		references: [tasksTable.id],
	}),
	user: one(usersTable, {
		fields: [commentsTable.authorId],
		references: [usersTable.externalId],
	}),
}));

export const workspaceRepositoriesRelations = relations(
	workspaceRepositoriesTable,
	({ one }) => ({
		workspace: one(workspacesTable, {
			fields: [workspaceRepositoriesTable.workspaceId],
			references: [workspacesTable.externalId],
		}),
		githubRepoInfo: one(githubRepoInfoTable, {
			fields: [workspaceRepositoriesTable.repoId],
			references: [githubRepoInfoTable.id],
		}),
	}),
);

export const projectRelations = relations(projectsTable, ({ one }) => ({
	team: one(teamsTable, {
		fields: [projectsTable.teamId],
		references: [teamsTable.id],
	}),
	workspace: one(workspacesTable, {
		fields: [projectsTable.workspaceId],
		references: [workspacesTable.externalId],
	}),
}));

export const commitRelations = relations(commitsTable, ({ one }) => ({
	pullRequest: one(githubPullRequestsTable, {
		fields: [commitsTable.pullId],
		references: [githubPullRequestsTable.externalId],
	}),
	task: one(tasksTable, {
		fields: [commitsTable.taskId],
		references: [tasksTable.id],
	}),
}));

export const taskEventRelations = relations(taskEventsTable, ({ one }) => ({
	task: one(tasksTable, {
		fields: [taskEventsTable.taskId],
		references: [tasksTable.id],
	}),
	user: one(usersTable, {
		fields: [taskEventsTable.authorId],
		references: [usersTable.externalId],
	}),
}));

export const savedFilterRelations = relations(savedFiltersTable, ({ one }) => ({
	workspace: one(workspacesTable, {
		fields: [savedFiltersTable.workspaceId],
		references: [workspacesTable.externalId],
	}),
	team: one(teamsTable, {
		fields: [savedFiltersTable.teamId],
		references: [teamsTable.id],
	}),
	user: one(usersTable, {
		fields: [savedFiltersTable.authorId],
		references: [usersTable.externalId],
	}),
}));

export const retrospectiveItemRelations = relations(
	retrospectiveItemsTable,
	({ one }) => ({
		sprint_wentWellSprintId: one(sprintsTable, {
			fields: [retrospectiveItemsTable.wentWellSprintId],
			references: [sprintsTable.id],
			relationName: "retrospectiveItem_wentWellSprintId_sprint_id",
		}),
		sprint_toImproveSprintId: one(sprintsTable, {
			fields: [retrospectiveItemsTable.toImproveSprintId],
			references: [sprintsTable.id],
			relationName: "retrospectiveItem_toImproveSprintId_sprint_id",
		}),
		sprint_actionItemsSprintId: one(sprintsTable, {
			fields: [retrospectiveItemsTable.actionItemsSprintId],
			references: [sprintsTable.id],
			relationName: "retrospectiveItem_actionItemsSprintId_sprint_id",
		}),
		user: one(usersTable, {
			fields: [retrospectiveItemsTable.authorId],
			references: [usersTable.externalId],
		}),
	}),
);

export const blockedTasksRelations = relations(
	blockedTasksTable,
	({ one }) => ({
		task_a: one(tasksTable, {
			fields: [blockedTasksTable.a],
			references: [tasksTable.id],
			relationName: "blockedTasks_a_task_id",
		}),
		task_b: one(tasksTable, {
			fields: [blockedTasksTable.b],
			references: [tasksTable.id],
			relationName: "blockedTasks_b_task_id",
		}),
	}),
);

export const userWorkspaceRelations = relations(
	userWorkspacesTable,
	({ one }) => ({
		workspace: one(workspacesTable, {
			fields: [userWorkspacesTable.workspaceId],
			references: [workspacesTable.externalId],
		}),
		user: one(usersTable, {
			fields: [userWorkspacesTable.userId],
			references: [usersTable.externalId],
		}),
	}),
);

export const userTeamRelations = relations(userTeamsTable, ({ one }) => ({
	team: one(teamsTable, {
		fields: [userTeamsTable.teamId],
		references: [teamsTable.id],
	}),
	user: one(usersTable, {
		fields: [userTeamsTable.userId],
		references: [usersTable.externalId],
	}),
}));
