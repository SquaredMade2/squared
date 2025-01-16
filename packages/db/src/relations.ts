import { relations } from "drizzle-orm/relations";
import {
	blockedTasks,
	branch,
	comment,
	commit,
	githubRepoInfo,
	label,
	notification,
	project,
	retrospectiveItem,
	savedFilter,
	sprint,
	task,
	taskEvent,
	team,
	universalTokenLink,
	user,
	userTeam,
	userWorkspace,
	workspace,
	workspaceRepositories,
} from "./schema";

export const teamRelations = relations(team, ({ one, many }) => ({
	workspace: one(workspace, {
		fields: [team.workspaceId],
		references: [workspace.id],
	}),
	sprints: many(sprint),
	tasks: many(task),
	projects: many(project),
	savedFilters: many(savedFilter),
	userTeams: many(userTeam),
}));

export const workspaceRelations = relations(workspace, ({ many }) => ({
	teams: many(team),
	notifications: many(notification),
	users: many(user),
	tasks: many(task),
	labels: many(label),
	universalTokenLinks: many(universalTokenLink),
	workspaceRepositories: many(workspaceRepositories),
	projects: many(project),
	savedFilters: many(savedFilter),
	userWorkspaces: many(userWorkspace),
}));

export const branchRelations = relations(branch, ({ one, many }) => ({
	task: one(task, {
		fields: [branch.taskId],
		references: [task.id],
	}),
	githubRepoInfo: one(githubRepoInfo, {
		fields: [branch.githubRepoInfoId],
		references: [githubRepoInfo.id],
	}),
	commits: many(commit),
}));

export const taskRelations = relations(task, ({ one, many }) => ({
	branches: many(branch),
	notifications: many(notification),
	users: many(user, {
		relationName: "user_lastViewedTaskId_task_id",
	}),
	comments: many(comment),
	task: one(task, {
		fields: [task.parentId],
		references: [task.id],
		relationName: "task_parentId_task_id",
	}),
	tasks: many(task, {
		relationName: "task_parentId_task_id",
	}),
	team: one(team, {
		fields: [task.teamId],
		references: [team.id],
	}),
	workspace: one(workspace, {
		fields: [task.workspaceId],
		references: [workspace.id],
	}),
	sprint: one(sprint, {
		fields: [task.sprintId],
		references: [sprint.id],
	}),
	user_authorId: one(user, {
		fields: [task.authorId],
		references: [user.externalId],
		relationName: "task_authorId_user_externalId",
	}),
	user_assigneeId: one(user, {
		fields: [task.assigneeId],
		references: [user.externalId],
		relationName: "task_assigneeId_user_externalId",
	}),
	commits: many(commit),
	taskEvents: many(taskEvent),
	blockedTasks_a: many(blockedTasks, {
		relationName: "blockedTasks_a_task_id",
	}),
	blockedTasks_b: many(blockedTasks, {
		relationName: "blockedTasks_b_task_id",
	}),
}));

export const githubRepoInfoRelations = relations(
	githubRepoInfo,
	({ many }) => ({
		branches: many(branch),
		workspaceRepositories: many(workspaceRepositories),
	}),
);

export const sprintRelations = relations(sprint, ({ one, many }) => ({
	team: one(team, {
		fields: [sprint.teamId],
		references: [team.id],
	}),
	tasks: many(task),
	retrospectiveItems_wentWellSprintId: many(retrospectiveItem, {
		relationName: "retrospectiveItem_wentWellSprintId_sprint_id",
	}),
	retrospectiveItems_toImproveSprintId: many(retrospectiveItem, {
		relationName: "retrospectiveItem_toImproveSprintId_sprint_id",
	}),
	retrospectiveItems_actionItemsSprintId: many(retrospectiveItem, {
		relationName: "retrospectiveItem_actionItemsSprintId_sprint_id",
	}),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
	task: one(task, {
		fields: [notification.taskId],
		references: [task.id],
	}),
	workspace: one(workspace, {
		fields: [notification.workspaceId],
		references: [workspace.id],
	}),
	user: one(user, {
		fields: [notification.userId],
		references: [user.externalId],
	}),
}));

export const userRelations = relations(user, ({ one, many }) => ({
	notifications: many(notification),
	workspace: one(workspace, {
		fields: [user.defaultWorkspaceId],
		references: [workspace.id],
	}),
	task: one(task, {
		fields: [user.lastViewedTaskId],
		references: [task.id],
		relationName: "user_lastViewedTaskId_task_id",
	}),
	comments: many(comment),
	tasks_authorId: many(task, {
		relationName: "task_authorId_user_externalId",
	}),
	tasks_assigneeId: many(task, {
		relationName: "task_assigneeId_user_externalId",
	}),
	taskEvents: many(taskEvent),
	savedFilters: many(savedFilter),
	retrospectiveItems: many(retrospectiveItem),
	userWorkspaces: many(userWorkspace),
	userTeams: many(userTeam),
}));

export const commentRelations = relations(comment, ({ one }) => ({
	task: one(task, {
		fields: [comment.taskId],
		references: [task.id],
	}),
	user: one(user, {
		fields: [comment.authorId],
		references: [user.externalId],
	}),
}));

export const labelRelations = relations(label, ({ one }) => ({
	workspace: one(workspace, {
		fields: [label.workspaceId],
		references: [workspace.id],
	}),
}));

export const universalTokenLinkRelations = relations(
	universalTokenLink,
	({ one }) => ({
		workspace: one(workspace, {
			fields: [universalTokenLink.workspaceId],
			references: [workspace.id],
		}),
	}),
);

export const workspaceRepositoriesRelations = relations(
	workspaceRepositories,
	({ one }) => ({
		workspace: one(workspace, {
			fields: [workspaceRepositories.workspaceId],
			references: [workspace.id],
		}),
		githubRepoInfo: one(githubRepoInfo, {
			fields: [workspaceRepositories.repoId],
			references: [githubRepoInfo.id],
		}),
	}),
);

export const projectRelations = relations(project, ({ one }) => ({
	team: one(team, {
		fields: [project.teamId],
		references: [team.id],
	}),
	workspace: one(workspace, {
		fields: [project.workspaceId],
		references: [workspace.id],
	}),
}));

export const commitRelations = relations(commit, ({ one }) => ({
	branch: one(branch, {
		fields: [commit.branchId],
		references: [branch.id],
	}),
	task: one(task, {
		fields: [commit.taskId],
		references: [task.id],
	}),
}));

export const taskEventRelations = relations(taskEvent, ({ one }) => ({
	task: one(task, {
		fields: [taskEvent.taskId],
		references: [task.id],
	}),
	user: one(user, {
		fields: [taskEvent.authorId],
		references: [user.externalId],
	}),
}));

export const savedFilterRelations = relations(savedFilter, ({ one }) => ({
	workspace: one(workspace, {
		fields: [savedFilter.workspaceId],
		references: [workspace.id],
	}),
	team: one(team, {
		fields: [savedFilter.teamId],
		references: [team.id],
	}),
	user: one(user, {
		fields: [savedFilter.authorId],
		references: [user.externalId],
	}),
}));

export const retrospectiveItemRelations = relations(
	retrospectiveItem,
	({ one }) => ({
		sprint_wentWellSprintId: one(sprint, {
			fields: [retrospectiveItem.wentWellSprintId],
			references: [sprint.id],
			relationName: "retrospectiveItem_wentWellSprintId_sprint_id",
		}),
		sprint_toImproveSprintId: one(sprint, {
			fields: [retrospectiveItem.toImproveSprintId],
			references: [sprint.id],
			relationName: "retrospectiveItem_toImproveSprintId_sprint_id",
		}),
		sprint_actionItemsSprintId: one(sprint, {
			fields: [retrospectiveItem.actionItemsSprintId],
			references: [sprint.id],
			relationName: "retrospectiveItem_actionItemsSprintId_sprint_id",
		}),
		user: one(user, {
			fields: [retrospectiveItem.authorId],
			references: [user.externalId],
		}),
	}),
);

export const blockedTasksRelations = relations(blockedTasks, ({ one }) => ({
	task_a: one(task, {
		fields: [blockedTasks.a],
		references: [task.id],
		relationName: "blockedTasks_a_task_id",
	}),
	task_b: one(task, {
		fields: [blockedTasks.b],
		references: [task.id],
		relationName: "blockedTasks_b_task_id",
	}),
}));

export const userWorkspaceRelations = relations(userWorkspace, ({ one }) => ({
	workspace: one(workspace, {
		fields: [userWorkspace.workspaceId],
		references: [workspace.id],
	}),
	user: one(user, {
		fields: [userWorkspace.userId],
		references: [user.externalId],
	}),
}));

export const userTeamRelations = relations(userTeam, ({ one }) => ({
	team: one(team, {
		fields: [userTeam.teamId],
		references: [team.id],
	}),
	user: one(user, {
		fields: [userTeam.userId],
		references: [user.externalId],
	}),
}));
