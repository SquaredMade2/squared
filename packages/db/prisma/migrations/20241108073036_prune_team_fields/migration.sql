/*
  Warnings:

  - You are about to drop the column `activeRequired` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `upcomingSprints` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "activeRequired",
DROP COLUMN "upcomingSprints";
