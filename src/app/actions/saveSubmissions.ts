"use server";
import { db } from "@/db";
import { quizzSubmitions } from "@/db/schema";
import { auth } from "@/auth";
import { InferInsertModel, eq } from "drizzle-orm";

type Submission = InferInsertModel<typeof quizzSubmitions>;

export async function saveSubmission(sub: Submission, quizzId: number) {
  const { score } = sub;

  const newSubmission = await db
    .insert(quizzSubmitions)
    .values({ score, quizzId })
    .returning({ insertedId: quizzSubmitions.id });

  const submissionId = newSubmission[0].insertedId;
  return submissionId;
}
