DROP INDEX "teamIdx";--> statement-breakpoint
DROP INDEX "workspaceIdx";--> statement-breakpoint
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_githubRepoInfoId_fkey" FOREIGN KEY ("githubRepoInfoId") REFERENCES "public"."GithubRepoInfo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("externalId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Label" ADD CONSTRAINT "Label_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("externalId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("externalId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_sprintId_fkey" FOREIGN KEY ("wentWellSprintId","toImproveSprintId","actionItemsSprintId") REFERENCES "public"."Sprint"("id","id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "public"."Sprint"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("externalId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sprint" ADD CONSTRAINT "sprints_team_id_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("externalId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."Team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."User"("externalId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "public"."User"("externalId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "public"."Sprint"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Team" ADD CONSTRAINT "Team_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UniversalTokenLink" ADD CONSTRAINT "UniversalTokenLink_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("externalId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("externalId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_defaultWorkspaceId_fkey" FOREIGN KEY ("defaultWorkspaceId") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WorkspaceRepositories" ADD CONSTRAINT "WorkspaceRepositories_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WorkspaceRepositories" ADD CONSTRAINT "WorkspaceRepositories_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "public"."GithubRepoInfo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workspaceIdx" ON "Notification" USING btree ("workspaceId" uuid_ops);--> statement-breakpoint
CREATE INDEX "taskIdx" ON "Notification" USING btree ("taskId" uuid_ops);--> statement-breakpoint
CREATE INDEX "wentWellSprintIdIdx" ON "RetrospectiveItem" USING btree ("wentWellSprintId" uuid_ops);--> statement-breakpoint
CREATE INDEX "toImproveSprintIdIdx" ON "RetrospectiveItem" USING btree ("toImproveSprintId" uuid_ops);--> statement-breakpoint
CREATE INDEX "actionItemsSprintIdIdx" ON "RetrospectiveItem" USING btree ("actionItemsSprintId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "team_name_idx" ON "Sprint" USING btree ("teamId","name");--> statement-breakpoint
CREATE UNIQUE INDEX "UniversalTokenLink_workspaceId_key" ON "UniversalTokenLink" USING btree ("workspaceId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "UserWorkspace_workspaceId_userId_key" ON "UserWorkspace" USING btree ("workspaceId" uuid_ops,"userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_externalId_key" ON "User" USING btree ("externalId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_defaultWorkspaceId_key" ON "User" USING btree ("defaultWorkspaceId" uuid_ops);--> statement-breakpoint
CREATE INDEX "lastViewedTaskIdIdx" ON "User" USING btree ("lastViewedTaskId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Workspace_url_key" ON "Workspace" USING btree ("url" text_ops);