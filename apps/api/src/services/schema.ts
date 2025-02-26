import type {
	Comment,
	GithubCommit,
	GithubRepo,
	Label,
	Notification,
	Sprint,
	Task,
	Team,
	User,
	UserWorkspace,
	Workspace,
} from "@squared/db";
import { createEnumSchema, createSchema } from "@squared/rpc";
import z from "zod";

export const statusEnum = createEnumSchema<Task["status"]>()(
	z.enum([
		"backlog",
		"todo",
		"inProgress",
		"inReview",
		"done",
		"canceled",
		"archived",
		"duplicated",
	]),
);

export const workspaceRoleEnum = z.enum([
	"org:admin",
	"org:member",
	"org:owner",
]);

export const labelSchema = createSchema<Label>()(
	z.object({
		name: z.string(),
		description: z.string().nullable().optional(),
		color: z.string(),
	}),
);

export const taskSchema = createSchema<Task>()(
	z.object({
		id: z.string(),
		title: z.string(),
		description: z.string().nullable(),
		status: statusEnum,
		sprintId: z.string().nullable(),
		teamId: z.string(),
		updatedAt: z.date(),
		authorId: z.string(),
		identifier: z.string(),
		dueDate: z.date().nullable(),
		effortEstimate: z.number().min(1).max(5).nullable(),
		priority: z.enum(["noPriority", "urgent", "high", "medium", "low"]),
		dateCreated: z.date(),
		assigneeId: z.string().nullable(),
		labels: z.array(labelSchema),
		workspaceId: z.string(),
		parentId: z.string().nullable(),
		deleted: z.boolean(),
		order: z.number(),
	}),
);

export const sprintSchema = createSchema<Sprint>()(
	z.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable(),
		startDate: z.date(),
		endDate: z.date(),
		status: z.enum(["PLANNED", "ACTIVE", "COMPLETED"]),
		teamId: z.string(),
		createdAt: z.date(),
		updatedAt: z.date(),
	}),
);

export const notificationSchema = createSchema<Notification>()(
	z.object({
		id: z.string(),
		userId: z.string(),
		taskId: z.string(),
		workspaceId: z.string(),
		read: z.boolean(),
		saved: z.boolean(),
		description: z.string().nullable(),
		createdAt: z.date(),
		updatedAt: z.date(),
		dismissed: z.boolean(),
		type: z.enum(["ASSIGNED", "PARTICIPATING", "MENTIONED", "CREATED"]),
	}),
);

export const commitSchema = createSchema<GithubCommit>()(
	z.object({
		id: z.string(),
		externalId: z.string(),
		message: z.string().nullable(),
		url: z.string(),
		author: z.string().nullable(),
		repoId: z.string(),
		pullId: z.string(),
		timestamp: z.date(),
	}),
);

export const githubRepoSchema = createSchema<GithubRepo>()(
	z.object({
		id: z.string(),
		externalId: z.string(),
		private: z.boolean(),
		description: z.string().nullable(),
		url: z.string(),
		name: z.string(),
		orgId: z.string(),
	}),
);

export const workspaceSchema = createSchema<Workspace>()(
	z.object({
		id: z.string(),
		externalId: z.string(),
		name: z.string(),
		url: z.string(),
		companySize: z.number().nullable(),
		tasksCreated: z.number(),
		avatarUrl: z.string().nullable(),
		admins: z.array(z.string()),
		defaultView: z.string().nullable(),
		labels: z.array(labelSchema),
		createdAt: z.date(),
	}),
);

export const userWorkspaceSchema = createSchema<UserWorkspace>()(
	z.object({
		userId: z.string(),
		workspaceId: z.string(),
	}),
);

export const commentSchema = createSchema<Comment>()(
	z.object({
		id: z.string(),
		comment: z.string(),
		authorId: z.string(),
		taskId: z.string(),
		date: z.date(),
	}),
);

export const userSchema = createSchema<User>()(
	z.object({
		id: z.string().uuid(),
		name: z.string(),
		username: z.string().nullable(),
		email: z.string().email(),
		externalId: z.string(),
		createdAt: z.date(),
		onBoarding: z.boolean(),
		defaultWorkspaceId: z.string().nullable(),
		avatarUrl: z.string().nullable(),
		savedNotificationIds: z.array(z.string()),
		subscribedTasks: z.array(z.string()),
		githubUsername: z.string().nullable(),
		lastViewedTaskId: z.string().nullable(),
	}),
);

export const teamSchema = createSchema<Team>()(
	z.object({
		name: z.string().nullable(),
		id: z.string(),
		identifier: z.string(),
		workspaceId: z.string(),
		sprintsEnabled: z.boolean(),
		sprintDuration: z.number(),
		cooldownDuration: z.number(),
		sprintStartDate: z.date(),
		tasksPerSprint: z.number(),
		effort: z.enum(["LINEAR", "FIBONACCI", "EXPONENTIAL"]),
	}),
);
