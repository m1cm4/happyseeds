CREATE TYPE "public"."acquisition_date_precision" AS ENUM('month', 'year', 'unknown');--> statement-breakpoint
ALTER TABLE "seed" ADD COLUMN "acquisition_date_precision" "acquisition_date_precision" DEFAULT 'unknown';--> statement-breakpoint
ALTER TABLE "seed" ADD COLUMN "user_label" text;