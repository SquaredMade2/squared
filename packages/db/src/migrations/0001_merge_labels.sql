-- Create a temporary table to store label mappings
CREATE TEMPORARY TABLE temp_label_mapping (
    old_id UUID,
    workspace_id UUID,
    label_data JSONB
);

-- Populate the temporary table
INSERT INTO temp_label_mapping (old_id, workspace_id, label_data)
SELECT id, "workspaceId", jsonb_build_object('name', name, 'description', description, 'color', color)
FROM "Label";

-- Add the new labels column to the Workspace table
ALTER TABLE "Workspace" ADD COLUMN "labels" JSONB DEFAULT '[]'::JSONB NOT NULL;

-- Migrate labels to the Workspace table
UPDATE "Workspace" w
SET labels = COALESCE(
    (SELECT jsonb_agg(tlm.label_data)
     FROM temp_label_mapping tlm
     WHERE tlm.workspace_id = w.id),
    '[]'::JSONB
);

-- Step 1: Add a temporary column for transformed labels in the Task table
ALTER TABLE "Task" ADD COLUMN "labels_temp" JSONB DEFAULT '[]'::JSONB NOT NULL;

-- Step 2: Populate the new column with the transformed data
UPDATE "Task" t
SET labels_temp = COALESCE(
    (SELECT jsonb_agg(tlm.label_data)
     FROM temp_label_mapping tlm
     WHERE tlm.old_id = ANY(t.labels::UUID[])),
    '[]'::JSONB
);

-- Step 3: Drop the old labels column
ALTER TABLE "Task" DROP COLUMN "labels";

-- Step 4: Rename the temporary column to labels
ALTER TABLE "Task" RENAME COLUMN "labels_temp" TO "labels";

-- Set the new default value for the labels column in the Task table
ALTER TABLE "Task" ALTER COLUMN "labels" SET DEFAULT '[]'::JSONB;

-- Drop the old Label table
ALTER TABLE "Label" DISABLE ROW LEVEL SECURITY;
DROP TABLE "Label" CASCADE;

-- Clean up: drop the temporary table
DROP TABLE temp_label_mapping;
