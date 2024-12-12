-- AlterTable
ALTER TABLE "RetrospectiveItem" ADD COLUMN     "likes" TEXT[] DEFAULT ARRAY[]::TEXT[];
