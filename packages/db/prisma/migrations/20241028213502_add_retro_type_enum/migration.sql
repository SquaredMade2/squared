/*
  Warnings:

  - Changed the type of `type` on the `RetrospectiveItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `authorId` on table `SavedFilter` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RetrospectiveItemType" AS ENUM ('wentWell', 'toImprove', 'actionItems');

-- AlterTable
ALTER TABLE "RetrospectiveItem" DROP COLUMN "type",
ADD COLUMN     "type" "RetrospectiveItemType" NOT NULL DEFAULT 'toImprove';

