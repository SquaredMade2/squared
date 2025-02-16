ALTER TABLE "RetrospectiveItem" DROP CONSTRAINT "RetrospectiveItem_wentWellSprintId_fkey";
--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" DROP CONSTRAINT "RetrospectiveItem_toImproveSprintId_fkey";
--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" DROP CONSTRAINT "RetrospectiveItem_actionItemsSprintId_fkey";
--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" RENAME COLUMN "wentWellSprintId" TO "sprintId";--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" ADD CONSTRAINT "RetrospectiveItem_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "public"."Sprint"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" DROP COLUMN "toImproveSprintId";--> statement-breakpoint
ALTER TABLE "RetrospectiveItem" DROP COLUMN "actionItemsSprintId";