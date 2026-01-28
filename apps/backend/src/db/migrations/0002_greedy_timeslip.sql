CREATE TYPE "public"."plant_category" AS ENUM('vegetable', 'fruit', 'flower', 'herb', 'shrub', 'other');--> statement-breakpoint
CREATE TYPE "public"."sun_requirement" AS ENUM('full_sun', 'partial_shade', 'shade');--> statement-breakpoint
CREATE TYPE "public"."water_requirement" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TABLE "plants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"latin_name" text,
	"category" "plant_category" NOT NULL,
	"description" text,
	"sowing_depth_mm" integer,
	"sowing_spacing_cm" integer,
	"germination_days_min" integer,
	"germination_days_max" integer,
	"growth_days_min" integer,
	"growth_days_max" integer,
	"sun_requirement" "sun_requirement",
	"water_requirement" "water_requirement",
	"notes" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plants" ADD CONSTRAINT "plants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;