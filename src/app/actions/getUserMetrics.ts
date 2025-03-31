import { quizzes, quizzSubmitions, questions, users } from "@/db/schema";
import { auth } from "@/auth";
import { avg, count, eq } from "drizzle-orm";
import { db } from "@/db";

const getUserMetrics = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  //get total number user quizzes
  const numQuizzes = await db
    .select({ value: count() })
    .from(quizzes)
    .where(eq(quizzes.userId, userId));

  //get total number user questions
  const numQuestions = await db
    .select({ value: count() })
    .from(questions)
    .innerJoin(quizzes, eq(questions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId));

  //get total number user submissions
  const numSubmissions = await db
    .select({ value: count() })
    .from(quizzSubmitions)
    .innerJoin(quizzes, eq(quizzSubmitions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId));

  //get average score
  const avgScore = await db
    .select({ value: avg(quizzSubmitions.score) })
    .from(quizzSubmitions)
    .innerJoin(quizzes, eq(quizzSubmitions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId));

  return [
    { label: "Quizzes", value: numQuizzes[0].value },
    { label: "Questions", value: numQuestions[0].value },
    { label: "Submissions", value: numSubmissions[0].value },
    { label: "Average score", value: avgScore[0].value },
  ];
};

export default getUserMetrics;
