ALTER TABLE "user" ALTER COLUMN "subscribed" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "premium_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "daily_quizzes_created" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_quiz_reset_date" timestamp;--> statement-breakpoint
ALTER TABLE "quizzes" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "trial_premium";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "trial_premium_start_date";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "trial_premium_end_date";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "premium_end_date";