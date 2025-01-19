-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('owner', 'admin', 'member');

-- AlterTable
ALTER TABLE "UserWorkspace" ADD COLUMN     "role" "WorkspaceRole" NOT NULL DEFAULT 'member';
