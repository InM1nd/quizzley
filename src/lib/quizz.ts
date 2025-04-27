import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Quizz {
  id: number;
  name: string | null;
  description: string | null;
  userId: string | null;
  status?: string | null;
  questions: {
    id: number;
    questionText: string | null;
    quizzId: number | null;
    answers: {
      id: number;
      questionId: number | null;
      answerText: string | null;
      isCorrect: boolean | null;
    }[];
  }[];
}

export async function getQuizzById(id: string): Promise<Quizz | null> {
  const quizzId = parseInt(id);
  if (isNaN(quizzId)) {
    return null;
  }

  const quizz = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, quizzId),
    with: {
      questions: {
        with: {
          answers: true,
        },
      },
    },
  });

  if (!quizz) {
    return null;
  }

  if (quizz.status === "processing") {
    return {
      ...quizz,
      questions: [],
    };
  }

  if (quizz.questions.length === 0 && quizz.status === "completed") {
    return null;
  }

  return {
    ...quizz,
    questions: quizz.questions.map((q) => ({ ...q, answer: q.answers })),
  };
}
