/*
  Warnings:

  - Made the column `authorId` on table `SavedFilter` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Effort" AS ENUM ('LINEAR', 'FIBONACCI', 'EXPONENTIAL');

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "effort" "Effort" NOT NULL DEFAULT 'LINEAR';
