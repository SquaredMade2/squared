-- Clear the SavedFilter table
DELETE FROM "SavedFilter";

-- AlterTable: Add the new column
ALTER TABLE "SavedFilter" 
ADD COLUMN "authorId" TEXT NOT NULL;

-- AddForeignKey: Create the foreign key constraint
ALTER TABLE "SavedFilter" 
ADD CONSTRAINT "SavedFilter_authorId_fkey" 
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
