-- Step 1: Ensure externalId is not nullable and unique
ALTER TABLE "User" ALTER COLUMN "externalId" SET NOT NULL;
ALTER TABLE "User" ADD CONSTRAINT "User_externalId_unique" UNIQUE ("externalId");

-- Step 2: Create temporary columns for foreign keys
ALTER TABLE "Comment" ADD COLUMN "temp_authorId" TEXT;
ALTER TABLE "TaskEvent" ADD COLUMN "temp_authorId" TEXT;
ALTER TABLE "Notification" ADD COLUMN "temp_userId" TEXT;
ALTER TABLE "Task" ADD COLUMN "temp_authorId" TEXT;
ALTER TABLE "Task" ADD COLUMN "temp_assigneeId" TEXT;
ALTER TABLE "SavedFilter" ADD COLUMN "temp_authorId" TEXT;
ALTER TABLE "UserWorkspace" ADD COLUMN "temp_userId" TEXT;
ALTER TABLE "UserTeam" ADD COLUMN "temp_userId" TEXT;
ALTER TABLE "RetrospectiveItem" ADD COLUMN "temp_authorId" TEXT;

-- Step 3: Update foreign key references in related tables
UPDATE "Comment" c
SET "temp_authorId" = u."externalId"
FROM "User" u
WHERE c."authorId" = u.id;

UPDATE "TaskEvent" te
SET "temp_authorId" = u."externalId"
FROM "User" u
WHERE te."authorId" = u.id;

UPDATE "Notification" n
SET "temp_userId" = u."externalId"
FROM "User" u
WHERE n."userId" = u.id;

UPDATE "Task" t
SET "temp_authorId" = u."externalId"
FROM "User" u
WHERE t."authorId" = u.id;

UPDATE "Task" t
SET "temp_assigneeId" = u."externalId"
FROM "User" u
WHERE t."assigneeId" = u.id;

UPDATE "SavedFilter" sf
SET "temp_authorId" = u."externalId"
FROM "User" u
WHERE sf."authorId" = u.id;

UPDATE "UserWorkspace" uw
SET "temp_userId" = u."externalId"
FROM "User" u
WHERE uw."userId" = u.id;

UPDATE "UserTeam" ut
SET "temp_userId" = u."externalId"
FROM "User" u
WHERE ut."userId" = u.id;

UPDATE "RetrospectiveItem" ri
SET "temp_authorId" = u."externalId"
FROM "User" u
WHERE ri."authorId" = u.id;

-- Step 4: Drop old foreign key constraints
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_authorId_fkey";
ALTER TABLE "TaskEvent" DROP CONSTRAINT IF EXISTS "TaskEvent_authorId_fkey";
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";
ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_authorId_fkey";
ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_assigneeId_fkey";
ALTER TABLE "SavedFilter" DROP CONSTRAINT IF EXISTS "SavedFilter_authorId_fkey";
ALTER TABLE "UserWorkspace" DROP CONSTRAINT IF EXISTS "UserWorkspace_userId_fkey";
ALTER TABLE "UserTeam" DROP CONSTRAINT IF EXISTS "UserTeam_userId_fkey";
ALTER TABLE "RetrospectiveItem" DROP CONSTRAINT IF EXISTS "RetrospectiveItem_authorId_fkey";

-- Step 5: Rename temporary columns to replace old columns
ALTER TABLE "Comment" DROP COLUMN "authorId";
ALTER TABLE "Comment" RENAME COLUMN "temp_authorId" TO "authorId";

ALTER TABLE "TaskEvent" DROP COLUMN "authorId";
ALTER TABLE "TaskEvent" RENAME COLUMN "temp_authorId" TO "authorId";

ALTER TABLE "Notification" DROP COLUMN "userId";
ALTER TABLE "Notification" RENAME COLUMN "temp_userId" TO "userId";

ALTER TABLE "Task" DROP COLUMN "authorId";
ALTER TABLE "Task" RENAME COLUMN "temp_authorId" TO "authorId";

ALTER TABLE "Task" DROP COLUMN "assigneeId";
ALTER TABLE "Task" RENAME COLUMN "temp_assigneeId" TO "assigneeId";

ALTER TABLE "SavedFilter" DROP COLUMN "authorId";
ALTER TABLE "SavedFilter" RENAME COLUMN "temp_authorId" TO "authorId";

ALTER TABLE "UserWorkspace" DROP COLUMN "userId";
ALTER TABLE "UserWorkspace" RENAME COLUMN "temp_userId" TO "userId";

ALTER TABLE "UserTeam" DROP COLUMN "userId";
ALTER TABLE "UserTeam" RENAME COLUMN "temp_userId" TO "userId";

ALTER TABLE "RetrospectiveItem" DROP COLUMN "authorId";
ALTER TABLE "RetrospectiveItem" RENAME COLUMN "temp_authorId" TO "authorId";

-- Step 6: Add new foreign key constraints
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("externalId") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 7: Clean up any orphaned records (optional, use with caution)
DELETE FROM "Comment" WHERE "authorId" IS NULL;
DELETE FROM "TaskEvent" WHERE "authorId" IS NULL;
DELETE FROM "Notification" WHERE "userId" IS NULL;
DELETE FROM "Task" WHERE "authorId" IS NULL;
DELETE FROM "SavedFilter" WHERE "authorId" IS NULL;
DELETE FROM "UserWorkspace" WHERE "userId" IS NULL;
DELETE FROM "UserTeam" WHERE "userId" IS NULL;
DELETE FROM "RetrospectiveItem" WHERE "authorId" IS NULL;

-- Step 8: Drop old columns
ALTER TABLE "User" DROP COLUMN "githubId",
DROP COLUMN "googleId",
DROP COLUMN "password",
DROP COLUMN "verified";

-- Step 9: Enforce NOT NULL constraints
ALTER TABLE "Comment" ALTER COLUMN "authorId" SET NOT NULL;
ALTER TABLE "Notification" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "RetrospectiveItem" ALTER COLUMN "authorId" SET NOT NULL;
ALTER TABLE "SavedFilter" ALTER COLUMN "authorId" SET NOT NULL;
ALTER TABLE "Task" ALTER COLUMN "authorId" SET NOT NULL;
ALTER TABLE "TaskEvent" ALTER COLUMN "authorId" SET NOT NULL;
ALTER TABLE "UserTeam" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "UserWorkspace" ALTER COLUMN "userId" SET NOT NULL;

-- Step 10: Add primary key constraints
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_pkey" PRIMARY KEY ("userId", "teamId");
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_pkey" PRIMARY KEY ("userId", "workspaceId");
