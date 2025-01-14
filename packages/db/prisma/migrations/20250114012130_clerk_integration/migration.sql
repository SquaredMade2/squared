/*
  Warnings:

  - You are about to drop the column `githubId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - Made the column `externalId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/

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

-- Commit the transaction
COMMIT;


-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "RetrospectiveItem" DROP CONSTRAINT "RetrospectiveItem_authorId_fkey";

-- DropForeignKey
ALTER TABLE "SavedFilter" DROP CONSTRAINT "SavedFilter_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_authorId_fkey";

-- DropForeignKey
ALTER TABLE "TaskEvent" DROP CONSTRAINT "TaskEvent_authorId_fkey";

-- DropForeignKey
ALTER TABLE "UserTeam" DROP CONSTRAINT "UserTeam_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWorkspace" DROP CONSTRAINT "UserWorkspace_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "githubId",
DROP COLUMN "googleId",
DROP COLUMN "password",
DROP COLUMN "verified",
ALTER COLUMN "externalId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("externalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFilter" ADD CONSTRAINT "SavedFilter_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
