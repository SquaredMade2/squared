ALTER TABLE "UniversalTokenLink" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "UniversalTokenLink" CASCADE;--> statement-breakpoint
ALTER TABLE "Workspace" ADD COLUMN "externalId" text;--> statement-breakpoint
ALTER TABLE "Workspace" DROP COLUMN "universalTokenLinkId";--> statement-breakpoint
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_externalId_unique" UNIQUE("externalId");