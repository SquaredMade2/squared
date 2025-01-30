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

-- Update the Task table to use the new label format
UPDATE "Task" t
SET labels = COALESCE(
    (SELECT jsonb_agg(tlm.label_data)
     FROM temp_label_mapping tlm
     WHERE tlm.old_id = ANY(t.labels::UUID[])),
    '[]'::JSONB
);

-- Alter the Task table column type
ALTER TABLE "Task" ALTER COLUMN "labels" SET DATA TYPE JSONB;
ALTER TABLE "Task" ALTER COLUMN "labels" SET DEFAULT '[]'::JSONB;

-- Drop the old Label table
ALTER TABLE "Label" DISABLE ROW LEVEL SECURITY;
DROP TABLE "Label" CASCADE;

-- Clean up: drop the temporary table
DROP TABLE temp_label_mapping;

