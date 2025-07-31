ALTER TABLE "user" ADD COLUMN "trial_premium" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "trial_premium_start_date" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "trial_premium_end_date" timestamp;