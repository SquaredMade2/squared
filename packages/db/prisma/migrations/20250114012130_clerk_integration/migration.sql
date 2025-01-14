-- Make externalId unique and not nullable
ALTER TABLE "User" ALTER COLUMN "externalId" SET NOT NULL;
ALTER TABLE "User" ADD CONSTRAINT "User_externalId_unique" UNIQUE ("externalId");

-- Update foreign key references
-- TaskEvent.authorId references User.externalId
ALTER TABLE "TaskEvent" DROP CONSTRAINT "TaskEvent_authorId_fkey";
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- Comment.authorId references User.externalId
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- Notification.userId references User.externalId
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- Task.authorId and assigneeId reference User.externalId
ALTER TABLE "Task" DROP CONSTRAINT "Task_authorId_fkey";
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigneeId_fkey";
ALTER TABLE "Task" ADD CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("externalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- UserWorkspace.userId references User.externalId
ALTER TABLE "UserWorkspace" DROP CONSTRAINT "UserWorkspace_userId_fkey";
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- UserTeam.userId references User.externalId
ALTER TABLE "UserTeam" DROP CONSTRAINT "UserTeam_userId_fkey";
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- RetrospectiveItem.authorId references User.externalId
ALTER TABLE "RetrospectiveItem" DROP CONSTRAINT "RetrospectiveItem_authorId_fkey";
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("externalId") ON DELETE CASCADE ON UPDATE CASCADE;
