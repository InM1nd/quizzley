ALTER TABLE "answers" RENAME COLUMN "question_text" TO "question_id";--> statement-breakpoint
ALTER TABLE "authenticator" DROP CONSTRAINT "authenticator_userId_credentialId_pk";--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userid_credentialid_pk" PRIMARY KEY("userId","credentialId");