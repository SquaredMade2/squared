/*
  Warnings:

  - Added the required column `authorId` to the `RetrospectiveItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetrospectiveItem" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
