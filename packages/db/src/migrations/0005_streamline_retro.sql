-- First, add the new sprintId column
ALTER TABLE "RetrospectiveItem" ADD COLUMN "sprintId" UUID;

-- Update the sprintId column with the non-null value from the three existing columns
UPDATE "RetrospectiveItem"
SET "sprintId" = COALESCE("wentWellSprintId", "toImproveSprintId", "actionItemsSprintId");

-- Remove rows where sprintId is null
DELETE FROM "RetrospectiveItem" WHERE "sprintId" IS NULL;

-- Make sprintId not null
ALTER TABLE "RetrospectiveItem" ALTER COLUMN "sprintId" SET NOT NULL;

-- Add the foreign key constraint
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_sprintId_fkey" 
FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop the old columns and constraints
ALTER TABLE "RetrospectiveItem" DROP CONSTRAINT IF EXISTS "RetrospectiveItem_wentWellSprintId_fkey";
ALTER TABLE "RetrospectiveItem" DROP CONSTRAINT IF EXISTS "RetrospectiveItem_toImproveSprintId_fkey";
ALTER TABLE "RetrospectiveItem" DROP CONSTRAINT IF EXISTS "RetrospectiveItem_actionItemsSprintId_fkey";
ALTER TABLE "RetrospectiveItem" DROP COLUMN "wentWellSprintId";
ALTER TABLE "RetrospectiveItem" DROP COLUMN "toImproveSprintId";
ALTER TABLE "RetrospectiveItem" DROP COLUMN "actionItemsSprintId";