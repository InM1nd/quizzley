import { quizzes, questions, quizzSubmitions } from "@/db/schema";
import { auth } from "@/auth";
import { count, eq, max } from "drizzle-orm";
import { db } from "@/db";

export interface UserQuizzes {
  id: number;
  name: string | null;
  description: string | null;
  userId: string | null;
  status: string | null;
  questionCount: number;
  score: number | null;
  createdAt: Date | null;
}

const getUserQuizzes = async (): Promise<UserQuizzes[]> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  const userQuizzes = await db
    .select({
      id: quizzes.id,
      name: quizzes.name,
      description: quizzes.description,
      userId: quizzes.userId,
      status: quizzes.status,
      questionCount: count(questions.id),
      score: max(quizzSubmitions.score),
      createdAt: max(quizzSubmitions.createdAt),
    })
    .from(quizzes)
    .leftJoin(questions, eq(questions.quizzId, quizzes.id))
    .leftJoin(quizzSubmitions, eq(quizzSubmitions.quizzId, quizzes.id))
    .where(eq(quizzes.userId, userId))
    .groupBy(
      quizzes.id,
      quizzes.name,
      quizzes.description,
      quizzes.userId,
      quizzes.status
    );

  return userQuizzes;
};

export default getUserQuizzes;
