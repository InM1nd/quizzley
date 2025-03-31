CREATE TABLE IF NOT EXISTS "quizz_submitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quizz_id" integer,
	"score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "authenticator" RENAME COLUMN "credentialID" TO "credentialId";--> statement-breakpoint
ALTER TABLE "authenticator" DROP CONSTRAINT "authenticator_credentialID_unique";--> statement-breakpoint
ALTER TABLE "authenticator" DROP CONSTRAINT "authenticator_userId_credentialID_pk";--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_credentialId_pk" PRIMARY KEY("userId","credentialId");--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_credentialId_unique" UNIQUE("credentialId");