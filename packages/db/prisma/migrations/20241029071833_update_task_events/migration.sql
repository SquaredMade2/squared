/*
  Warnings:

  - You are about to drop the column `activityId` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `added` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `authorEmail` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `authorUsername` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `committerEmail` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `committerName` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `committerUsername` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `distinct` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `modified` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `removed` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `treeId` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `activityId` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the column `gitUpdated` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the column `originalAssigneeId` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the column `originalAssigneeName` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the column `originalLabels` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the column `originalValue` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAssigneeId` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAssigneeName` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the column `updatedLabels` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the column `updatedValue` on the `TaskEvent` table. All the data in the column will be lost.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskEventLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `branchId` to the `Commit` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `timestamp` on the `Commit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `authorId` on table `SavedFilter` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `message` to the `TaskEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_eventLogId_fkey";

-- DropForeignKey
ALTER TABLE "Commit" DROP CONSTRAINT "Commit_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Commit" DROP CONSTRAINT "Commit_treeId_fkey";

-- DropForeignKey
ALTER TABLE "TaskEvent" DROP CONSTRAINT "TaskEvent_activityId_fkey";

-- DropForeignKey
ALTER TABLE "TaskEvent" DROP CONSTRAINT "TaskEvent_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskEventLog" DROP CONSTRAINT "TaskEventLog_taskId_fkey";

-- DropIndex
DROP INDEX "Commit_activityId_key";

-- DropIndex
DROP INDEX "TaskEvent_activityId_key";

-- AlterTable
ALTER TABLE "Commit" DROP COLUMN "activityId",
DROP COLUMN "added",
DROP COLUMN "authorEmail",
DROP COLUMN "authorUsername",
DROP COLUMN "committerEmail",
DROP COLUMN "committerName",
DROP COLUMN "committerUsername",
DROP COLUMN "distinct",
DROP COLUMN "modified",
DROP COLUMN "removed",
DROP COLUMN "treeId",
ADD COLUMN     "branchId" TEXT NOT NULL,
ADD COLUMN     "taskId" TEXT,
DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SavedFilter" ALTER COLUMN "authorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TaskEvent" DROP COLUMN "activityId",
DROP COLUMN "gitUpdated",
DROP COLUMN "originalAssigneeId",
DROP COLUMN "originalAssigneeName",
DROP COLUMN "originalLabels",
DROP COLUMN "originalValue",
DROP COLUMN "type",
DROP COLUMN "updatedAssigneeId",
DROP COLUMN "updatedAssigneeName",
DROP COLUMN "updatedLabels",
DROP COLUMN "updatedValue",
ADD COLUMN     "message" TEXT NOT NULL;

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "TaskEventLog";

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
