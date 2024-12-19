-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastViewedTaskId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastViewedTaskId_fkey" FOREIGN KEY ("lastViewedTaskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
