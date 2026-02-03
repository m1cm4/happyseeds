CREATE TYPE "public"."hardiness" AS ENUM('perennial', 'biennial', 'annual', 'hardy_annual', 'semi_hardy_annual', 'non_hardy_annual');--> statement-breakpoint
CREATE TYPE "public"."position" AS ENUM('full_sun', 'partial_shade', 'shade');--> statement-breakpoint
CREATE TABLE "plant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "plant_category" NOT NULL,
	"common_name" text NOT NULL,
	"other_common_names" text,
	"family" text,
	"genus" text,
	"species" text,
	"cultivar" text,
	"description" text,
	"hardiness" "hardiness",
	"hardiness_degrees" text,
	"height" text,
	"spread" text,
	"position" "position"[],
	"flowers" text,
	"stratification" boolean,
	"inside_sowing_period" integer[],
	"outside_sowing_period" integer[],
	"inside_germinate_time" integer,
	"outside_germinate_time" integer,
	"cover_to_germinate" boolean,
	"sowing_depth" integer,
	"best_sowing_temp" text,
	"planting_period" integer[],
	"time_first_flower" integer,
	"sowing_information" text,
	"growing_instruction" text,
	"author_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plants" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "plants" CASCADE;--> statement-breakpoint
-- ALTER TABLE "seeds" DROP CONSTRAINT "seeds_plant_id_plants_id_fk";
--> statement-breakpoint
ALTER TABLE "plant" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."plant_category";--> statement-breakpoint
CREATE TYPE "public"."plant_category" AS ENUM('ornamental', 'vegetable');--> statement-breakpoint
ALTER TABLE "plant" ALTER COLUMN "category" SET DATA TYPE "public"."plant_category" USING "category"::"public"."plant_category";--> statement-breakpoint
ALTER TABLE "plant" ADD CONSTRAINT "plant_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "seeds" ADD CONSTRAINT "seeds_plant_id_plant_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."sun_requirement";--> statement-breakpoint
DROP TYPE "public"."water_requirement";