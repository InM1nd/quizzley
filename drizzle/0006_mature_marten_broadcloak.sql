CREATE TABLE IF NOT EXISTS "user_activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"activity_type" text NOT NULL,
	"description" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_login_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "login_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "total_quizzes_created" integer DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_activity_logs" ADD CONSTRAINT "user_activity_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
