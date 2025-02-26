-- Step 1: Drop existing foreign key constraints
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_workspaceId_fkey";
ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "Project_workspaceId_fkey";
ALTER TABLE "SavedFilter" DROP CONSTRAINT IF EXISTS "SavedFilter_workspaceId_fkey";
ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_workspaceId_fkey";
ALTER TABLE "Team" DROP CONSTRAINT IF EXISTS "Team_workspaceId_fkey";
ALTER TABLE "UserWorkspace" DROP CONSTRAINT IF EXISTS "UserWorkspace_workspaceId_fkey";
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_defaultWorkspaceId_fkey";
ALTER TABLE "WorkspaceRepositories" DROP CONSTRAINT IF EXISTS "WorkspaceRepositories_workspaceId_fkey";

-- Step 2: Alter column types to text
ALTER TABLE "Notification" ALTER COLUMN "workspaceId" TYPE text USING "workspaceId"::text;
ALTER TABLE "Project" ALTER COLUMN "workspaceId" TYPE text USING "workspaceId"::text;
ALTER TABLE "SavedFilter" ALTER COLUMN "workspaceId" TYPE text USING "workspaceId"::text;
ALTER TABLE "Task" ALTER COLUMN "workspaceId" TYPE text USING "workspaceId"::text;
ALTER TABLE "Team" ALTER COLUMN "workspaceId" TYPE text USING "workspaceId"::text;
ALTER TABLE "UserWorkspace" ALTER COLUMN "workspaceId" TYPE text USING "workspaceId"::text;
ALTER TABLE "User" ALTER COLUMN "defaultWorkspaceId" TYPE text USING "defaultWorkspaceId"::text;
ALTER TABLE "WorkspaceRepositories" ALTER COLUMN "workspaceId" TYPE text USING "workspaceId"::text;

-- Step 3: Update foreign key values to match workspace externalId
UPDATE "Notification" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id"::text = "Notification"."workspaceId");
UPDATE "Project" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id"::text = "Project"."workspaceId");
UPDATE "SavedFilter" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id"::text = "SavedFilter"."workspaceId");
UPDATE "Task" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id"::text = "Task"."workspaceId");
UPDATE "Team" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id"::text = "Team"."workspaceId");
UPDATE "UserWorkspace" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id"::text = "UserWorkspace"."workspaceId");
UPDATE "User" SET "defaultWorkspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id"::text = "User"."defaultWorkspaceId");
UPDATE "WorkspaceRepositories" SET "workspaceId" = (SELECT "externalId" FROM "Workspace" WHERE "Workspace"."id"::text = "WorkspaceRepositories"."workspaceId");

-- Step 4: Set externalId as NOT NULL in Workspace table
ALTER TABLE "Workspace" ALTER COLUMN "externalId" SET NOT NULL;

-- Step 5: Add new foreign key constraints
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Team" ADD CONSTRAINT "Team_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_defaultWorkspaceId_fkey" FOREIGN KEY ("defaultWorkspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "WorkspaceRepositories" ADD CONSTRAINT "WorkspaceRepositories_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;