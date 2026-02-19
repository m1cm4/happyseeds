CREATE TYPE "public"."sowing_entry_location" AS ENUM('indoor', 'greenhouse', 'outdoor');--> statement-breakpoint
CREATE TYPE "public"."sowing_entry_status" AS ENUM('planned', 'sowing', 'germinating', 'growing', 'transplanted', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "sowing_entry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"seed_id" uuid NOT NULL,
	"planned_start_date" date NOT NULL,
	"actual_start_date" date,
	"estimated_end_date" date,
	"actual_end_date" date,
	"quantity" integer NOT NULL,
	"location" "sowing_entry_location",
	"status" "sowing_entry_status" DEFAULT 'planned' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sowing_entry" ADD CONSTRAINT "sowing_entry_session_id_sowing_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sowing_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sowing_entry" ADD CONSTRAINT "sowing_entry_seed_id_seed_id_fk" FOREIGN KEY ("seed_id") REFERENCES "public"."seed"("id") ON DELETE restrict ON UPDATE no action;