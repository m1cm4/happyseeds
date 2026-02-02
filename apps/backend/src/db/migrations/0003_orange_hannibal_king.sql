CREATE TYPE "public"."acquisiton_type" AS ENUM('harvest', 'purchase', 'gift', 'unknown');--> statement-breakpoint
CREATE TABLE "seeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plant_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"brand" text,
	"quantity" integer DEFAULT 0,
	"aquisition_type" "acquisiton_type" DEFAULT 'unknown',
	"acquisition_date" date,
	"expiration_date" date,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "seeds" ADD CONSTRAINT "seeds_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seeds" ADD CONSTRAINT "seeds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;