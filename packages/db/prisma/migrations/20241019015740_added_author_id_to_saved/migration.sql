-- Clear invalid SavedFilter rows where authorId doesn't exist in User
DELETE FROM "SavedFilter"
WHERE "authorId" IS NOT NULL
AND "authorId" NOT IN (SELECT "id" FROM "User");

-- AddForeignKey: Create the foreign key constraint
ALTER TABLE "SavedFilter" 
ADD CONSTRAINT "SavedFilter_authorId_fkey" 
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
