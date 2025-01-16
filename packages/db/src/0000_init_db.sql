-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."ActivityType" AS ENUM('TASK_EVENT', 'COMMIT');--> statement-breakpoint
CREATE TYPE "public"."Effort" AS ENUM('LINEAR', 'FIBONACCI', 'EXPONENTIAL');--> statement-breakpoint
CREATE TYPE "public"."NotificationType" AS ENUM('ASSIGNED', 'PARTICIPATING', 'MENTIONED', 'CREATED');--> statement-breakpoint
CREATE TYPE "public"."Priority" AS ENUM('noPriority', 'urgent', 'high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."RetrospectiveItemType" AS ENUM('wentWell', 'toImprove', 'actionItems');--> statement-breakpoint
CREATE TYPE "public"."SavedFilterType" AS ENUM('TEAM', 'WORKSPACE');--> statement-breakpoint
CREATE TYPE "public"."SprintStatus" AS ENUM('PLANNED', 'ACTIVE', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."Status" AS ENUM('backlog', 'todo', 'inProgress', 'inReview', 'done', 'canceled', 'archived');--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"identifier" text NOT NULL,
	"workspaceId" text NOT NULL,
	"sprintsEnabled" boolean DEFAULT false NOT NULL,
	"sprintDuration" integer DEFAULT 2 NOT NULL,
	"cooldownDuration" integer DEFAULT 1 NOT NULL,
	"sprintStartDate" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tasksPerSprint" integer DEFAULT 10 NOT NULL,
	"effort" "Effort" DEFAULT 'LINEAR' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Branch" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"taskId" text NOT NULL,
	"githubRepoInfoId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "GithubRepoInfo" (
	"id" text PRIMARY KEY NOT NULL,
	"repoName" text DEFAULT '' NOT NULL,
	"owner" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Sprint" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"startDate" timestamp(3) NOT NULL,
	"endDate" timestamp(3) NOT NULL,
	"status" "SprintStatus" NOT NULL,
	"teamId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "Notification" (
	"id" text PRIMARY KEY NOT NULL,
	"taskId" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"saved" boolean DEFAULT false NOT NULL,
	"description" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"workspaceId" text NOT NULL,
	"dismissed" boolean DEFAULT false NOT NULL,
	"type" "NotificationType" NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Workspace" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"companySize" integer,
	"tasksCreated" integer DEFAULT 0 NOT NULL,
	"universalTokenLinkId" text,
	"avatarUrl" text,
	"admins" text[],
	"defaultView" text
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"username" text,
	"email" text NOT NULL,
	"lastLogin" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"onBoarding" boolean DEFAULT true NOT NULL,
	"defaultWorkspaceId" text,
	"avatarUrl" text,
	"savedNotificationIds" text[] DEFAULT '{"RAY"}',
	"subscribedTasks" text[] DEFAULT '{"RAY"}',
	"githubUsername" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"lastViewedTaskId" text,
	"externalId" text NOT NULL,
	CONSTRAINT "User_externalId_unique" UNIQUE("externalId")
);
--> statement-breakpoint
CREATE TABLE "Comment" (
	"id" text PRIMARY KEY NOT NULL,
	"comment" text NOT NULL,
	"date" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"taskId" text NOT NULL,
	"authorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Task" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"identifier" text NOT NULL,
	"dueDate" timestamp(3),
	"effortEstimate" integer,
	"teamId" text NOT NULL,
	"dateCreated" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"labels" text[],
	"workspaceId" text NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"parentId" text,
	"sprintId" text,
	"status" "Status" DEFAULT 'backlog' NOT NULL,
	"priority" "Priority" DEFAULT 'noPriority' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"authorId" text NOT NULL,
	"assigneeId" text
);
--> statement-breakpoint
CREATE TABLE "Label" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text NOT NULL,
	"workspaceId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UniversalTokenLink" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text DEFAULT '' NOT NULL,
	"isEnabled" boolean DEFAULT true NOT NULL,
	"workspaceId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WorkspaceRepositories" (
	"id" text PRIMARY KEY NOT NULL,
	"workspaceId" text NOT NULL,
	"repoId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"teamId" text,
	"workspaceId" text
);
--> statement-breakpoint
CREATE TABLE "Commit" (
	"id" text PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"url" text NOT NULL,
	"authorName" text,
	"repoName" text,
	"owner" text,
	"branchId" text NOT NULL,
	"taskId" text,
	"timestamp" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TaskEvent" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"taskId" text NOT NULL,
	"message" text NOT NULL,
	"authorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SavedFilter" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '',
	"filter" jsonb[],
	"workspaceId" text,
	"teamId" text,
	"type" "SavedFilterType" NOT NULL,
	"sprintId" text,
	"authorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "RetrospectiveItem" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"wentWellSprintId" text,
	"toImproveSprintId" text,
	"actionItemsSprintId" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"type" "RetrospectiveItemType" DEFAULT 'toImprove' NOT NULL,
	"likes" text[] DEFAULT '{"RAY"}',
	"authorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_BlockedTasks" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_BlockedTasks_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "UserWorkspace" (
	"workspaceId" text NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "UserWorkspace_pkey" PRIMARY KEY("workspaceId","userId")
);
--> statement-breakpoint
CREATE TABLE "UserTeam" (
	"teamId" text NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "UserTeam_pkey" PRIMARY KEY("teamId","userId")
);
--> statement-breakpoint
ALTER TABLE "Team" ADD CONSTRAINT "Team_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_githubRepoInfoId_fkey" FOREIGN KEY ("githubRepoInfoId") REFERENCES "public"."GithubRepoInfo"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_defaultWorkspaceId_fkey" FOREIGN KEY ("defaultWorkspaceId") REFERENCES "public"."Workspace"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_lastViewedTaskId_fkey" FOREIGN KEY ("lastViewedTaskId") REFERENCES "public"."Task"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Task"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "public"."Sprint"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "public"."User"("externalId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Label" ADD CONSTRAINT "Label_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UniversalTokenLink" ADD CONSTRAINT "UniversalTokenLink_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkspaceRepositories" ADD CONSTRAINT "WorkspaceRepositories_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkspaceRepositories" ADD CONSTRAINT "WorkspaceRepositories_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "public"."GithubRepoInfo"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_wentWellSprintId_fkey" FOREIGN KEY ("wentWellSprintId") REFERENCES "public"."Sprint"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_toImproveSprintId_fkey" FOREIGN KEY ("toImproveSprintId") REFERENCES "public"."Sprint"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_actionItemsSprintId_fkey" FOREIGN KEY ("actionItemsSprintId") REFERENCES "public"."Sprint"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_BlockedTasks" ADD CONSTRAINT "_BlockedTasks_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Task"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_BlockedTasks" ADD CONSTRAINT "_BlockedTasks_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Task"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "Team_workspaceId_identifier_key" ON "Team" USING btree ("workspaceId" text_ops,"identifier" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "GithubRepoInfo_repoName_key" ON "GithubRepoInfo" USING btree ("repoName" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Workspace_url_key" ON "Workspace" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Task_teamId_identifier_key" ON "Task" USING btree ("teamId" text_ops,"identifier" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Task_workspaceId_identifier_key" ON "Task" USING btree ("workspaceId" text_ops,"identifier" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "UniversalTokenLink_workspaceId_key" ON "UniversalTokenLink" USING btree ("workspaceId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkspaceRepositories_workspaceId_repoId_key" ON "WorkspaceRepositories" USING btree ("workspaceId" text_ops,"repoId" text_ops);--> statement-breakpoint
CREATE INDEX "teamIdx" ON "SavedFilter" USING btree ("teamId" text_ops);--> statement-breakpoint
CREATE INDEX "workspaceIdx" ON "SavedFilter" USING btree ("workspaceId" text_ops);--> statement-breakpoint
CREATE INDEX "_BlockedTasks_B_index" ON "_BlockedTasks" USING btree ("B" text_ops);
*/