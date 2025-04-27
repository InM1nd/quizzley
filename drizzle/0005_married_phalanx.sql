DO $$ BEGIN
 CREATE TYPE "quizz_status" AS ENUM('processing', 'completed', 'error');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "status" "quizz_status" DEFAULT 'completed';