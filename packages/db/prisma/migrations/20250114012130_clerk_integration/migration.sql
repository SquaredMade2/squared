-- Start a transaction
BEGIN;

-- 1. Update all users with a temporary externalId if it's null
UPDATE "User"
SET "externalId" = gen_random_uuid()::text
WHERE "externalId" IS NULL;

-- 2. Update all related tables to use externalId instead of id

-- Update TaskEvent
UPDATE "TaskEvent" te
SET "authorId" = u."externalId"
FROM "User" u
WHERE te."authorId" = u.id;

-- Update Comment
UPDATE "Comment" c
SET "authorId" = u."externalId"
FROM "User" u
WHERE c."authorId" = u.id;

-- Update Notification
UPDATE "Notification" n
SET "userId" = u."externalId"
FROM "User" u
WHERE n."userId" = u.id;

-- Update Task (authorId)
UPDATE "Task" t
SET "authorId" = u."externalId"
FROM "User" u
WHERE t."authorId" = u.id;

-- Update Task (assigneeId)
UPDATE "Task" t
SET "assigneeId" = u."externalId"
FROM "User" u
WHERE t."assigneeId" = u.id;

-- Update SavedFilter
UPDATE "SavedFilter" sf
SET "authorId" = u."externalId"
FROM "User" u
WHERE sf."authorId" = u.id;

-- Update UserWorkspace
UPDATE "UserWorkspace" uw
SET "userId" = u."externalId"
FROM "User" u
WHERE uw."userId" = u.id;

-- Update UserTeam
UPDATE "UserTeam" ut
SET "userId" = u."externalId"
FROM "User" u
WHERE ut."userId" = u.id;

-- Update RetrospectiveItem
UPDATE "RetrospectiveItem" ri
SET "authorId" = u."externalId"
FROM "User" u
WHERE ri."authorId" = u.id;

-- 3. Drop foreign key constraints
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_authorId_fkey";
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";
ALTER TABLE "RetrospectiveItem" DROP CONSTRAINT IF EXISTS "RetrospectiveItem_authorId_fkey";
ALTER TABLE "SavedFilter" DROP CONSTRAINT IF EXISTS "SavedFilter_authorId_fkey";
ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_assigneeId_fkey";
ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_authorId_fkey";
ALTER TABLE "TaskEvent" DROP CONSTRAINT IF EXISTS "TaskEvent_authorId_fkey";
ALTER TABLE "UserTeam" DROP CONSTRAINT IF EXISTS "UserTeam_userId_fkey";
ALTER TABLE "UserWorkspace" DROP CONSTRAINT IF EXISTS "UserWorkspace_userId_fkey";

-- 4. Alter User table
ALTER TABLE "User" 
  DROP COLUMN IF EXISTS "githubId",
  DROP COLUMN IF EXISTS "googleId",
  DROP COLUMN IF EXISTS "password",
  DROP COLUMN IF EXISTS "verified",
  ALTER COLUMN "externalId" SET NOT NULL;

-- 5. Add new foreign key constraints
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_authorId_fkey" 
  FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" 
  FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Task" ADD CONSTRAINT "Task_authorId_fkey" 
  FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" 
  FOREIGN KEY ("assigneeId") REFERENCES "User"("externalId") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_authorId_fkey" 
  FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_authorId_fkey" 
  FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- Commit the transaction
COMMIT;