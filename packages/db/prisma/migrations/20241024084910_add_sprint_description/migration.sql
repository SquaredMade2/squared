/*
  Warnings:

  - Made the column `authorId` on table `SavedFilter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SavedFilter" ALTER COLUMN "authorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Sprint" 
  ADD COLUMN "description" TEXT,
