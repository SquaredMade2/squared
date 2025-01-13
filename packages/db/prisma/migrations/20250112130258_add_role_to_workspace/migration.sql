-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "UserWorkspace" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';
