-- Update Workspace externalId with id where it's null
UPDATE "Workspace" SET "externalId" = "id"::text WHERE "externalId" IS NULL;

-- Set Workspace externalId to NOT NULL
ALTER TABLE "Workspace" ALTER COLUMN "externalId" SET NOT NULL;

-- Update foreign key values to use Workspace.externalId
UPDATE "Notification" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id" = "Notification"."workspaceId");
UPDATE "Project" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id" = "Project"."workspaceId");
UPDATE "SavedFilter" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id" = "SavedFilter"."workspaceId");
UPDATE "Task" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id" = "Task"."workspaceId");
UPDATE "Team" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id" = "Team"."workspaceId");
UPDATE "UserWorkspace" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id" = "UserWorkspace"."workspaceId");
UPDATE "User" SET "defaultWorkspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id" = "User"."defaultWorkspaceId");
UPDATE "WorkspaceRepositories" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id" = "WorkspaceRepositories"."workspaceId");

-- Drop existing foreign key constraints
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_workspaceId_fkey";
ALTER TABLE "Project" DROP CONSTRAINT "Project_workspaceId_fkey";
ALTER TABLE "SavedFilter" DROP CONSTRAINT "SavedFilter_workspaceId_fkey";
ALTER TABLE "Task" DROP CONSTRAINT "Task_workspaceId_fkey";
ALTER TABLE "Team" DROP CONSTRAINT "Team_workspaceId_fkey";
ALTER TABLE "UserWorkspace" DROP CONSTRAINT "UserWorkspace_workspaceId_fkey";
ALTER TABLE "User" DROP CONSTRAINT "User_defaultWorkspaceId_fkey";
ALTER TABLE "WorkspaceRepositories" DROP CONSTRAINT "WorkspaceRepositories_workspaceId_fkey";

-- Add new foreign key constraints referencing Workspace.externalId
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Team" ADD CONSTRAINT "Team_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_defaultWorkspaceId_fkey" FOREIGN KEY ("defaultWorkspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "WorkspaceRepositories" ADD CONSTRAINT "WorkspaceRepositories_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;