import type { NotificationTask } from "@/store/notifications";
import type {
	Commit,
	Task,
	TaskEvent,
	User,
	Workspace,
	Notification,
	Comment,
	SavedFilter,
	Sprint,
} from "@repo/db";

export const STANDARD_USER: User = {
	id: "70C7FB67-6ECB-40E1-9AD6-2378700BDB7A",
	name: "Test User",
	email: "test@example.com",
	username: "testuser",
	password: null,
	verified: false,
	lastLogin: new Date(),
	onBoarding: false,
	defaultWorkspaceId: null,
	avatarUrl: null,
	savedNotificationIds: [],
	subscribedTasks: [],
	googleId: null,
	githubUsername: null,
	githubId: null,
};

export const STANDARD_WORKSPACE: Workspace = {
	id: "A8DBBA4C-71EB-46A0-87EA-4916571C8BB8",
	name: "Test Workspace",
	avatarUrl: null,
	url: "test-workspace",
	companySize: null,
	tasksCreated: 1,
	universalTokenLinkId: null,
	admins: [],
};

export const STANDARD_TASK: Task = {
	id: "2CC57CC9-5868-4314-84D0-121F215DF7DC",
	title: "Test Task",
	status: "todo",
	authorId: STANDARD_USER.id,
	identifier: "TSK-001",
	description: null,
	dueDate: null,
	effortEstimate: null,
	teamId: "team-1",
	dateCreated: new Date(),
	assigneeId: null,
	assigneeName: null,
	labels: [],
	workspaceId: STANDARD_WORKSPACE.id,
	updatedAt: new Date(),
	deleted: false,
	parentId: null,
	sprintId: null,
	priority: "medium",
};
export const STANDARD_TASK_2: Task = {
	id: "2278DBF6-E94A-4DCB-A90A-DC9997F7EDEE",
	title: "Test Task 2",
	status: "inProgress",
	authorId: STANDARD_USER.id,
	identifier: "TSK-002",
	description: null,
	dueDate: null,
	effortEstimate: null,
	teamId: "team-1",
	dateCreated: new Date(),
	assigneeId: null,
	assigneeName: null,
	labels: [],
	workspaceId: STANDARD_WORKSPACE.id,
	updatedAt: new Date(),
	deleted: false,
	parentId: null,
	sprintId: null,
	priority: "low",
};

export const STANDARD_SPRINT: Sprint = {
	id: "007168DD-DD4A-4013-9D5C-A3E6AE6868E5",
	name: "Sprint 1",
	startDate: new Date("2023-01-01"),
	endDate: new Date("2023-01-14"),
	status: "ACTIVE",
	teamId: "team-1",
	createdAt: new Date("2022-12-31"),
	updatedAt: new Date("2022-12-31"),
};

export const STANDARD_SAVED_FILTER: SavedFilter = {
	id: "D3702EC4-3918-4A7A-A466-563963C46D1F",
	name: "Saved Filter",
	filter: [{ field: "status", value: "In Progress", operator: "equals" }],
	authorId: "author-1",
	description: null,
	teamId: "team-1",
	workspaceId: STANDARD_WORKSPACE.id,
	type: "WORKSPACE",
};

export const STANDARD_SAVED_FILTER_2: SavedFilter = {
	id: "A9410BC5-DCA6-488A-A244-D2D0EBCC69BB",
	name: "Saved Filter 2",
	filter: [{ field: "status", value: "In Progress", operator: "equals" }],
	authorId: STANDARD_USER.id,
	description: null,
	teamId: "team-1",
	workspaceId: STANDARD_WORKSPACE.id,
	type: "WORKSPACE",
};

export const STANDARD_COMMENT: Comment = {
	id: "2617A499-4CD7-4CE8-91D1-51F2058179F7",
	comment: "Original comment",
	taskId: STANDARD_TASK.id,
	authorId: STANDARD_USER.id,
	date: new Date(),
};
export const STANDARD_COMMENT_2: Comment = {
	id: "17ADF8DD-EB50-4335-9A4E-7C72AE54375C",
	comment: "Second comment",
	taskId: STANDARD_TASK.id,
	authorId: STANDARD_USER.id,
	date: new Date(),
};

export const STANDARD_NOTIFICATION: Notification = {
	id: "C5851ED9-6125-4BD3-BA46-7BE2CA2CC73B",
	userId: STANDARD_USER.id,
	type: "ASSIGNED",
	read: false,
	createdAt: new Date(),
	updatedAt: new Date(),
	taskId: STANDARD_TASK.id,
	workspaceId: STANDARD_WORKSPACE.id,
	description: null,
	saved: false,
	dismissed: false,
};

export const STANDARD_NOTIFICATION_2: Notification = {
	id: "4D0C0704-DB4D-4BE8-9F92-286F8A87E467",
	userId: STANDARD_USER.id,
	type: "CREATED",
	read: false,
	createdAt: new Date(),
	updatedAt: new Date(),
	taskId: STANDARD_TASK.id,
	workspaceId: STANDARD_WORKSPACE.id,
	description: null,
	saved: false,
	dismissed: false,
};

export const STANDARD_NOTIFICATION_TASK: NotificationTask = {
	...STANDARD_NOTIFICATION,
	Task: STANDARD_TASK,
	Workspace: STANDARD_WORKSPACE,
};
export const STANDARD_NOTIFICATION_TASK_2: NotificationTask = {
	...STANDARD_NOTIFICATION_2,
	Task: STANDARD_TASK,
	Workspace: STANDARD_WORKSPACE,
};

export const STANDARD_COMMIT: Commit = {
	id: "FC3AB6C7-90C5-4376-AA9F-F1768CA6A085",
	treeId: "tree1",
	distinct: true,
	message: "Initial commit",
	timestamp: "2023-06-01T12:00:00Z",
	url: "https://github.com/repo/commit/1",
	authorName: STANDARD_USER.name,
	authorEmail: STANDARD_USER.email,
	authorUsername: STANDARD_USER.username,
	committerName: STANDARD_USER.name,
	committerEmail: STANDARD_USER.email,
	committerUsername: STANDARD_USER.username,
	added: ["file1.txt"],
	removed: [],
	modified: [],
	repoName: "repo",
	owner: "owner",
	activityId: "activity1",
};

export const STANDARD_TASK_EVENT: TaskEvent = {
	id: "8057DA5D-3412-4CB6-B192-7FE060AE1B9F",
	type: "CREATED",
	authorId: STANDARD_USER.id,
	authorName: STANDARD_USER.name,
	activityId: "activity1",
	createdAt: new Date(),
	taskId: "task1",
	originalValue: null,
	updatedValue: null,
	originalAssigneeId: null,
	originalAssigneeName: null,
	updatedAssigneeId: null,
	updatedAssigneeName: null,
	gitUpdated: null,
	originalLabels: [],
	updatedLabels: [],
};
