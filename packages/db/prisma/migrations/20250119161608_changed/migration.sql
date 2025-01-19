/*
  Warnings:

  - The `role` column on the `UserWorkspace` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('owner', 'admin', 'member');

-- AlterTable
ALTER TABLE "UserWorkspace" DROP COLUMN "role",
ADD COLUMN     "role" "WorkspaceRole" NOT NULL DEFAULT 'member';

-- DropEnum
DROP TYPE "Role";
