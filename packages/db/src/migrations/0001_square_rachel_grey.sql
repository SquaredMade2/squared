ALTER TABLE "SavedFilter" ALTER COLUMN "filter" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "SavedFilter" ALTER COLUMN "filter" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Sprint" ALTER COLUMN "startDate" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Sprint" ALTER COLUMN "updatedAt" SET DEFAULT now();