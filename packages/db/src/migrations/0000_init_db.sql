CREATE TYPE "public"."ActivityType" AS ENUM('TASK_EVENT', 'COMMIT');--> statement-breakpoint
CREATE TYPE "public"."Effort" AS ENUM('LINEAR', 'FIBONACCI', 'EXPONENTIAL');--> statement-breakpoint
CREATE TYPE "public"."NotificationType" AS ENUM('ASSIGNED', 'PARTICIPATING', 'MENTIONED', 'CREATED');--> statement-breakpoint
CREATE TYPE "public"."Priority" AS ENUM('noPriority', 'urgent', 'high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."RetrospectiveItemType" AS ENUM('wentWell', 'toImprove', 'actionItems');--> statement-breakpoint
CREATE TYPE "public"."SavedFilterType" AS ENUM('TEAM', 'WORKSPACE');--> statement-breakpoint
CREATE TYPE "public"."SprintStatus" AS ENUM('PLANNED', 'ACTIVE', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."Status" AS ENUM('backlog', 'todo', 'inProgress', 'inReview', 'done', 'canceled', 'archived');--> statement-breakpoint
CREATE TABLE "_BlockedTasks" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_BlockedTasks_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "Branch" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"taskId" uuid NOT NULL,
	"githubRepoInfoId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comment" text NOT NULL,
	"date" timestamp (3) DEFAULT now() NOT NULL,
	"taskId" uuid NOT NULL,
	"authorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Commit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message" text NOT NULL,
	"url" text NOT NULL,
	"authorName" text,
	"repoName" text,
	"owner" text,
	"branchId" uuid NOT NULL,
	"taskId" uuid,
	"timestamp" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "GithubRepoInfo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repoName" text NOT NULL,
	"owner" text NOT NULL,
	CONSTRAINT "GithubRepoInfo_repoName_unique" UNIQUE("repoName")
);
--> statement-breakpoint
CREATE TABLE "Label" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text NOT NULL,
	"workspaceId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taskId" uuid NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"saved" boolean DEFAULT false NOT NULL,
	"description" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"workspaceId" uuid NOT NULL,
	"dismissed" boolean DEFAULT false NOT NULL,
	"type" "NotificationType" NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"teamId" uuid,
	"workspaceId" uuid
);
--> statement-breakpoint
CREATE TABLE "RetrospectiveItem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"wentWellSprintId" uuid,
	"toImproveSprintId" uuid,
	"actionItemsSprintId" uuid,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"type" "RetrospectiveItemType" DEFAULT 'toImprove' NOT NULL,
	"likes" text[] DEFAULT '{}' NOT NULL,
	"authorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SavedFilter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '',
	"filter" jsonb NOT NULL,
	"workspaceId" uuid,
	"teamId" uuid,
	"type" "SavedFilterType" NOT NULL,
	"sprintId" uuid,
	"authorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Sprint" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"startDate" timestamp (3) DEFAULT now() NOT NULL,
	"endDate" timestamp (3) NOT NULL,
	"status" "SprintStatus" NOT NULL,
	"teamId" uuid NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "TaskEvent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"taskId" uuid NOT NULL,
	"message" text NOT NULL,
	"authorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"identifier" text NOT NULL,
	"due_date" timestamp,
	"effort_estimate" integer,
	"team_id" uuid NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"assignee_id" text,
	"labels" text[] DEFAULT '{}' NOT NULL,
	"workspace_id" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"parent_id" uuid,
	"sprint_id" uuid,
	"order" integer DEFAULT 0 NOT NULL,
	"status" "Status" DEFAULT 'backlog' NOT NULL,
	"priority" "Priority" DEFAULT 'noPriority' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"identifier" text NOT NULL,
	"workspaceId" uuid NOT NULL,
	"sprintsEnabled" boolean DEFAULT false NOT NULL,
	"sprintDuration" integer DEFAULT 2 NOT NULL,
	"cooldownDuration" integer DEFAULT 1 NOT NULL,
	"sprintStartDate" timestamp (3) DEFAULT now() NOT NULL,
	"tasksPerSprint" integer DEFAULT 10 NOT NULL,
	"effort" "Effort" DEFAULT 'LINEAR' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UniversalTokenLink" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text DEFAULT '' NOT NULL,
	"isEnabled" boolean DEFAULT true NOT NULL,
	"workspaceId" uuid NOT NULL,
	CONSTRAINT "UniversalTokenLink_workspaceId_unique" UNIQUE("workspaceId")
);
--> statement-breakpoint
CREATE TABLE "UserTeam" (
	"teamId" uuid NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "UserTeam_pkey" PRIMARY KEY("teamId","userId")
);
--> statement-breakpoint
CREATE TABLE "UserWorkspace" (
	"workspaceId" uuid NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "UserWorkspace_pkey" PRIMARY KEY("workspaceId","userId")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"externalId" text NOT NULL,
	"name" text NOT NULL,
	"username" text,
	"email" text NOT NULL,
	"lastLogin" timestamp (3) DEFAULT now() NOT NULL,
	"onBoarding" boolean DEFAULT true NOT NULL,
	"defaultWorkspaceId" uuid,
	"avatarUrl" text,
	"savedNotificationIds" text[] DEFAULT '{}' NOT NULL,
	"subscribedTasks" text[] DEFAULT '{}' NOT NULL,
	"githubUsername" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"lastViewedTaskId" uuid,
	CONSTRAINT "User_externalId_unique" UNIQUE("externalId"),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "WorkspaceRepositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspaceId" uuid NOT NULL,
	"repoId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Workspace" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"companySize" integer,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"tasksCreated" integer DEFAULT 0 NOT NULL,
	"universalTokenLinkId" uuid,
	"avatarUrl" text,
	"admins" text[] DEFAULT '{}' NOT NULL,
	"defaultView" text,
	CONSTRAINT "Workspace_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE INDEX "_BlockedTasks_B_index" ON "_BlockedTasks" USING btree ("B" text_ops);--> statement-breakpoint
CREATE INDEX "teamIdx" ON "SavedFilter" USING btree ("teamId" uuid_ops);--> statement-breakpoint
CREATE INDEX "workspaceIdx" ON "SavedFilter" USING btree ("workspaceId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_identifier_idx" ON "tasks" USING btree ("workspace_id","identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "team_identifier_idx" ON "tasks" USING btree ("team_id","identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "Team_workspaceId_identifier_key" ON "Team" USING btree ("workspaceId" uuid_ops,"identifier" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkspaceRepositories_workspaceId_repoId_key" ON "WorkspaceRepositories" USING btree ("workspaceId" uuid_ops,"repoId" uuid_ops);