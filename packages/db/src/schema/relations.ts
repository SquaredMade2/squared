import { relations } from "drizzle-orm/relations";
import {
	blockedTasksTable,
	commentsTable,
	githubCommitsTable,
	githubPullRequestsTable,
	githubPullRequestTaskTable,
	githubRepoTable,
	notificationsTable,
	projectsTable,
	retrospectiveItemsTable,
	savedFiltersTable,
	sprintsTable,
	taskEventsTable,
	tasksTable,
	teamsTable,
	usersTable,
	userTeamsTable,
	userWorkspacesTable,
	workspaceRepositoriesTable,
	workspacesTable,
} from "./schema";

export const teamRelations = relations(teamsTable, ({ one, many }) => ({
	projects: many(projectsTable),
	savedFilters: many(savedFiltersTable),
	sprints: many(sprintsTable),
	tasks: many(tasksTable),
	userTeams: many(userTeamsTable),
	workspace: one(workspacesTable, {
		fields: [teamsTable.workspaceId],
		references: [workspacesTable.externalId],
	}),
}));

export const workspaceRelations = relations(workspacesTable, ({ many }) => ({
	notifications: many(notificationsTable),
	projects: many(projectsTable),
	savedFilters: many(savedFiltersTable),
	tasks: many(tasksTable),
	teams: many(teamsTable),
	users: many(usersTable),
	userWorkspaces: many(userWorkspacesTable),
	workspaceRepositories: many(workspaceRepositoriesTable),
}));

export const taskRelations = relations(tasksTable, ({ one, many }) => ({
	blockedTasksA: many(blockedTasksTable, {
		relationName: "blockedTasks_a_task_id",
	}),
	blockedTasksB: many(blockedTasksTable, {
		relationName: "blockedTasks_b_task_id",
	}),
	comments: many(commentsTable),
	githubPullRequestTasks: many(githubPullRequestTaskTable),
	notifications: many(notificationsTable),
	sprint: one(sprintsTable, {
		fields: [tasksTable.sprintId],
		references: [sprintsTable.id],
	}),
	task: one(tasksTable, {
		fields: [tasksTable.parentId],
		references: [tasksTable.id],
		relationName: "task_parentId_task_id",
	}),
	taskEvents: many(taskEventsTable),
	tasks: many(tasksTable, {
		relationName: "task_parentId_task_id",
	}),
	team: one(teamsTable, {
		fields: [tasksTable.teamId],
		references: [teamsTable.id],
	}),
	userAssigneeId: one(usersTable, {
		fields: [tasksTable.assigneeId],
		references: [usersTable.externalId],
		relationName: "task_assigneeId_user_externalId",
	}),
	userAuthorId: one(usersTable, {
		fields: [tasksTable.authorId],
		references: [usersTable.externalId],
		relationName: "task_authorId_user_externalId",
	}),
	users: many(usersTable, {
		relationName: "user_lastViewedTaskId_task_id",
	}),
	workspace: one(workspacesTable, {
		fields: [tasksTable.workspaceId],
		references: [workspacesTable.externalId],
	}),
}));

export const sprintRelations = relations(sprintsTable, ({ one, many }) => ({
	retrospectiveItems: many(retrospectiveItemsTable, {
		relationName: "retrospectiveItem_sprint_id",
	}),
	tasks: many(tasksTable),
	team: one(teamsTable, {
		fields: [sprintsTable.teamId],
		references: [teamsTable.id],
	}),
}));

export const notificationRelations = relations(
	notificationsTable,
	({ one }) => ({
		task: one(tasksTable, {
			fields: [notificationsTable.taskId],
			references: [tasksTable.id],
		}),
		user: one(usersTable, {
			fields: [notificationsTable.userId],
			references: [usersTable.externalId],
		}),
		workspace: one(workspacesTable, {
			fields: [notificationsTable.workspaceId],
			references: [workspacesTable.externalId],
		}),
	}),
);

export const userRelations = relations(usersTable, ({ one, many }) => ({
	comments: many(commentsTable),
	notifications: many(notificationsTable),
	retrospectiveItems: many(retrospectiveItemsTable),
	savedFilters: many(savedFiltersTable),
	task: one(tasksTable, {
		fields: [usersTable.lastViewedTaskId],
		references: [tasksTable.id],
		relationName: "user_lastViewedTaskId_task_id",
	}),
	taskEvents: many(taskEventsTable),
	tasksAssigneeId: many(tasksTable, {
		relationName: "task_assigneeId_user_externalId",
	}),
	tasksAuthorId: many(tasksTable, {
		relationName: "task_authorId_user_externalId",
	}),
	userTeams: many(userTeamsTable),
	userWorkspaces: many(userWorkspacesTable),
	workspace: one(workspacesTable, {
		fields: [usersTable.defaultWorkspaceId],
		references: [workspacesTable.externalId],
	}),
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
	team: one(teamsTable, {
		fields: [savedFiltersTable.teamId],
		references: [teamsTable.id],
	}),
	user: one(usersTable, {
		fields: [savedFiltersTable.authorId],
		references: [usersTable.externalId],
	}),
	workspace: one(workspacesTable, {
		fields: [savedFiltersTable.workspaceId],
		references: [workspacesTable.externalId],
	}),
}));

export const retrospectiveItemRelations = relations(
	retrospectiveItemsTable,
	({ one }) => ({
		sprint: one(sprintsTable, {
			fields: [retrospectiveItemsTable.sprintId],
			references: [sprintsTable.id],
			relationName: "retrospectiveItem_sprint_id",
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
		taskA: one(tasksTable, {
			fields: [blockedTasksTable.a],
			references: [tasksTable.id],
			relationName: "blockedTasks_a_task_id",
		}),
		taskB: one(tasksTable, {
			fields: [blockedTasksTable.b],
			references: [tasksTable.id],
			relationName: "blockedTasks_b_task_id",
		}),
	}),
);

export const userWorkspaceRelations = relations(
	userWorkspacesTable,
	({ one }) => ({
		user: one(usersTable, {
			fields: [userWorkspacesTable.userId],
			references: [usersTable.externalId],
		}),
		workspace: one(workspacesTable, {
			fields: [userWorkspacesTable.workspaceId],
			references: [workspacesTable.externalId],
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

// Github
export const githubPullRequestRelations = relations(
	githubPullRequestsTable,
	({ one, many }) => ({
		commits: many(githubCommitsTable),
		githubPullRequestTasks: many(githubPullRequestTaskTable),
		githubRepoInfo: one(githubRepoTable, {
			fields: [githubPullRequestsTable.githubRepoInfoId],
			references: [githubRepoTable.externalId],
		}),
	}),
);

export const githubRepoRelations = relations(githubRepoTable, ({ many }) => ({
	pullRequests: many(githubPullRequestsTable),
	workspaceRepositories: many(workspaceRepositoriesTable),
}));

export const githubWorkspaceRepositoriesRelations = relations(
	workspaceRepositoriesTable,
	({ one }) => ({
		githubRepoInfo: one(githubRepoTable, {
			fields: [workspaceRepositoriesTable.repoId],
			references: [githubRepoTable.id],
		}),
		workspace: one(workspacesTable, {
			fields: [workspaceRepositoriesTable.workspaceId],
			references: [workspacesTable.externalId],
		}),
	}),
);

export const githubCommitRelations = relations(
	githubCommitsTable,
	({ one }) => ({
		pullRequest: one(githubPullRequestsTable, {
			fields: [githubCommitsTable.pullId],
			references: [githubPullRequestsTable.externalId],
		}),
		repo: one(githubRepoTable, {
			fields: [githubCommitsTable.repoId],
			references: [githubRepoTable.externalId],
		}),
	}),
);

export const githubPullRequestTaskRelations = relations(
	githubPullRequestTaskTable,
	({ one }) => ({
		pullRequest: one(githubPullRequestsTable, {
			fields: [githubPullRequestTaskTable.pullRequestId],
			references: [githubPullRequestsTable.externalId],
		}),
		task: one(tasksTable, {
			fields: [githubPullRequestTaskTable.taskId],
			references: [tasksTable.id],
		}),
	}),
);
