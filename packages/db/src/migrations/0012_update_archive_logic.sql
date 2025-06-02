ALTER TABLE "Workspace" ADD COLUMN "daysUntilArchive" integer DEFAULT 14 NOT NULL;--> statement-breakpoint
ALTER TABLE "Workspace" DROP COLUMN "archiveConfig";--> statement-breakpoint
ALTER TABLE "Workspace" ADD CONSTRAINT "daysUntilArchive_check" CHECK ("Workspace"."daysUntilArchive" >= 3 AND "Workspace"."daysUntilArchive" <= 30);