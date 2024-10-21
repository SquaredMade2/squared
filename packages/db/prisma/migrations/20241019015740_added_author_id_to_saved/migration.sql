-- Step 1: Add the authorId column
ALTER TABLE "SavedFilter"
ADD COLUMN "authorId" TEXT;

-- Step 2: Clear invalid SavedFilter rows where authorId doesn't exist in User
DELETE FROM "SavedFilter"
WHERE "authorId" IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM "User" WHERE "SavedFilter"."authorId" = "User"."id"
);

-- Step 3: Add the foreign key constraint
ALTER TABLE "SavedFilter"
ADD CONSTRAINT "SavedFilter_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
