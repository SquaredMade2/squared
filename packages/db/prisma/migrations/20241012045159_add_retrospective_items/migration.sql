/*
  Warnings:

  - You are about to drop the column `actionItems` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `toImprove` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `wentWell` on the `Sprint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "actionItems",
DROP COLUMN "toImprove",
DROP COLUMN "wentWell";

-- CreateTable
CREATE TABLE "RetrospectiveItem" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "wentWellSprintId" TEXT,
    "toImproveSprintId" TEXT,
    "actionItemsSprintId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RetrospectiveItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_wentWellSprintId_fkey" FOREIGN KEY ("wentWellSprintId") REFERENCES "Sprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_toImproveSprintId_fkey" FOREIGN KEY ("toImproveSprintId") REFERENCES "Sprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_actionItemsSprintId_fkey" FOREIGN KEY ("actionItemsSprintId") REFERENCES "Sprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
