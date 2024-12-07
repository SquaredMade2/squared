/*
  Warnings:

  - Made the column `upvotes` on table `RetrospectiveItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RetrospectiveItem" ALTER COLUMN "upvotes" SET NOT NULL;
