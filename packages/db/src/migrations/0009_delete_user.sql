CREATE TABLE "DeletedUsers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"deleted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "DeletedUsers" ADD CONSTRAINT "DeletedUsers_id_User_id_fk" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;