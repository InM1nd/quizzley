ALTER TABLE "user" ALTER COLUMN "subscribed" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "trial_premium_start_date" SET DEFAULT now();