import type {
	Comment,
	Commit,
	Label,
	Notification,
	RetrospectiveItem,
	SavedFilter,
	Sprint,
	Task,
	TaskEvent,
	Team,
	User,
	Workspace,
} from "@squared/db";

export const STANDARD_USER: User = {
	id: "70C7FB67-6ECB-40E1-9AD6-2378700BDB7A",
	name: "Test User",
	email: "test@example.com",
	username: "testuser",
	password: null,
	verified: false,
	lastLogin: new Date(),
	createdAt: new Date(),
	onBoarding: false,
	defaultWorkspaceId: null,
	avatarUrl: null,
	savedNotificationIds: [],
	subscribedTasks: [],
	googleId: null,
	githubUsername: null,
	githubId: null,
	lastViewedTaskId: null,
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

export const STANDARD_TEAM: Team = {
	id: "2AB8018F-2B1F-4E9D-9118-BF2AC5B3EA63",
	name: "Standard Team",
	identifier: "TSK",
	workspaceId: STANDARD_WORKSPACE.id,
	sprintsEnabled: true,
	sprintDuration: 2,
	cooldownDuration: 1,
	sprintStartDate: new Date("2023-01-01"),
	tasksPerSprint: 10,
	effort: "LINEAR",
};

export const STANDARD_TEAM_2: Team = {
	id: "39A93AC1-C149-4867-8A1E-9DBBC5C1F4FD",
	name: "Standard Team 2",
	identifier: "TSQ",
	workspaceId: STANDARD_WORKSPACE.id,
	sprintsEnabled: false,
	sprintDuration: 1,
	cooldownDuration: 0,
	sprintStartDate: new Date("2023-02-01"),
	tasksPerSprint: 8,
	effort: "FIBONACCI",
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
	labels: [],
	workspaceId: STANDARD_WORKSPACE.id,
	updatedAt: new Date(),
	deleted: false,
	parentId: null,
	sprintId: null,
	order: 0,
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
	order: 1,
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
	description: "First sprint",
	startDate: new Date("2023-01-01"),
	endDate: new Date("2023-01-14"),
	status: "ACTIVE",
	teamId: "team-1",
	createdAt: new Date("2022-12-31"),
	updatedAt: new Date("2022-12-31"),
};

export const STANDARD_RETROSPECTIVE_ITEM: RetrospectiveItem = {
	id: "retro-item-1",
	authorId: "user-1",
	likes: [],
	content: "Improved team communication",
	type: "wentWell",
	wentWellSprintId: "sprint-1",
	toImproveSprintId: null,
	actionItemsSprintId: null,
	createdAt: new Date("2023-01-15T10:00:00Z"),
	updatedAt: new Date("2023-01-15T10:00:00Z"),
};

export const STANDARD_TO_IMPROVE_ITEM: RetrospectiveItem = {
	...STANDARD_RETROSPECTIVE_ITEM,
	id: "retro-item-2",
	content: "Need to improve code review process",
	type: "toImprove",
	wentWellSprintId: null,
	toImproveSprintId: "sprint-1",
};

export const STANDARD_ACTION_ITEM: RetrospectiveItem = {
	...STANDARD_RETROSPECTIVE_ITEM,
	id: "retro-item-3",
	content: "Set up weekly code review sessions",
	type: "actionItems",
	wentWellSprintId: null,
	actionItemsSprintId: "sprint-1",
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
	sprintId: null,
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
	sprintId: "new-sprint-id-123",
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

export const STANDARD_COMMIT: Commit = {
	id: "FC3AB6C7-90C5-4376-AA9F-F1768CA6A085",
	message: "Initial commit",
	url: "https://github.com/repo/commit/1",
	authorName: STANDARD_USER.name,
	repoName: "repo",
	owner: "owner",
	taskId: STANDARD_TASK.id,
	branchId: "branch-1",
	timestamp: new Date("2023-06-01T12:00:00Z"),
};

export const STANDARD_TASK_EVENT: TaskEvent = {
	id: "8057DA5D-3412-4CB6-B192-7FE060AE1B9F",
	authorId: STANDARD_USER.id,
	createdAt: new Date(),
	taskId: "task1",
	message: "Task created",
};

export const STANDARD_LABEL: Label = {
	id: "792D082C-6BC0-4F1C-BF9E-17F862F7394E",
	name: "Feature",
	description: "New feature",
	color: "#FF5733",
	workspaceId: STANDARD_WORKSPACE.id,
};

export const STANDARD_LABEL_2: Label = {
	id: "62025D9B-EBED-4987-8C93-9B9946991422",
	name: "Bug",
	description: "Bug fix",
	color: "#C70039",
	workspaceId: STANDARD_WORKSPACE.id,
};

export const STANDARD_LABEL_3: Label = {
	id: "C46F4835-FC0E-4D2C-9817-6750E0791B16",
	name: "Chore",
	description: "General task",
	color: "#900C3F",
	workspaceId: STANDARD_WORKSPACE.id,
};

export const STANDARD_LABEL_4: Label = {
	id: "B16E825D-C53C-4657-889E-40F2E5ADEEED",
	name: "Refactor",
	description: "Code refactor",
	color: "#581845",
	workspaceId: STANDARD_WORKSPACE.id,
};

export const STANDARD_LABEL_5: Label = {
	id: "284F3FA1-6071-4C1B-A31A-C1E8D3051C1F",
	name: "Docs",
	description: "Documentation",
	color: "#FFC300",
	workspaceId: STANDARD_WORKSPACE.id,
};

export const STANDARD_LABEL_6: Label = {
	id: "B77FB60C-074D-4FA4-9C2D-3BAD05FE8BB8",
	name: "Test",
	description: "Testing task",
	color: "#DAF7A6",
	workspaceId: STANDARD_WORKSPACE.id,
};
