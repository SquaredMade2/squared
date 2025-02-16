CREATE TYPE "public"."PullRequestState" AS ENUM('open', 'closed');--> statement-breakpoint
CREATE TABLE "GithubCommit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"externalId" text NOT NULL,
	"message" text,
	"url" text NOT NULL,
	"author" text,
	"repoId" text NOT NULL,
	"pullId" text NOT NULL,
	"timestamp" timestamp (3) NOT NULL,
	CONSTRAINT "GithubCommit_externalId_unique" UNIQUE("externalId")
);
--> statement-breakpoint
CREATE TABLE "GithubPullRequestTask" (
	"pullRequestId" text NOT NULL,
	"taskId" uuid NOT NULL,
	CONSTRAINT "GithubPullRequestTask_pkey" PRIMARY KEY("pullRequestId","taskId")
);
--> statement-breakpoint
CREATE TABLE "GithubPullRequest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"externalId" text NOT NULL,
	"number" integer NOT NULL,
	"state" "PullRequestState" NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"branch" text NOT NULL,
	"timestamp" timestamp (3) NOT NULL,
	"body" text,
	"author" text NOT NULL,
	"githubRepoInfoId" text NOT NULL,
	CONSTRAINT "GithubPullRequest_externalId_unique" UNIQUE("externalId")
);
--> statement-breakpoint
CREATE TABLE "GithubRepo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"externalId" text NOT NULL,
	"private" boolean DEFAULT false NOT NULL,
	"description" text,
	"url" text NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	CONSTRAINT "GithubRepo_externalId_unique" UNIQUE("externalId")
);
--> statement-breakpoint
ALTER TABLE "Branch" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Commit" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "GithubRepoInfo" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "Branch" CASCADE;--> statement-breakpoint
DROP TABLE "Commit" CASCADE;--> statement-breakpoint
DROP TABLE "GithubRepoInfo" CASCADE;--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE "GithubCommit" ADD CONSTRAINT "Commit_pull_request_fkey" FOREIGN KEY ("pullId") REFERENCES "public"."GithubPullRequest"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GithubCommit" ADD CONSTRAINT "Commit_task_fkey" FOREIGN KEY ("repoId") REFERENCES "public"."GithubRepo"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GithubPullRequestTask" ADD CONSTRAINT "GithubPullRequestTask_pullRequestId_fkey" FOREIGN KEY ("pullRequestId") REFERENCES "public"."GithubPullRequest"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GithubPullRequestTask" ADD CONSTRAINT "GithubPullRequestTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GithubPullRequest" ADD CONSTRAINT "Branch_githubRepoInfoId_fkey" FOREIGN KEY ("githubRepoInfoId") REFERENCES "public"."GithubRepo"("externalId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "GithubRepoInfo_name_key" ON "GithubRepo" USING btree ("name" text_ops);--> statement-breakpoint
ALTER TABLE "WorkspaceRepositories" ADD CONSTRAINT "WorkspaceRepositories_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "public"."GithubRepo"("id") ON DELETE cascade ON UPDATE cascade;