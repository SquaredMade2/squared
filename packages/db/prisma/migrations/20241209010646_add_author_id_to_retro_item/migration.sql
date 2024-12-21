/*
  Warnings:

  - Added the required column `authorId` to the `RetrospectiveItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add authorId as nullable
ALTER TABLE "RetrospectiveItem" ADD COLUMN "authorId" TEXT;

-- Delete records without authorId
DELETE FROM "RetrospectiveItem" WHERE "authorId" IS NULL;

-- Make authorId non-nullable
ALTER TABLE "RetrospectiveItem" ALTER COLUMN "authorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
