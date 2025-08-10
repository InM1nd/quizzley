import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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

// Функция для получения квиза с проверкой принадлежности пользователю
export async function getQuizzByIdForUser(id: string, userId: string): Promise<Quizz | null> {
  const quizzId = parseInt(id);
  if (isNaN(quizzId)) {
    return null;
  }

  const quizz = await db.query.quizzes.findFirst({
    where: and(
      eq(quizzes.id, quizzId),
      eq(quizzes.userId, userId)
    ),
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

// Функция для проверки существования квиза (без вопросов)
export async function getQuizzStatusForUser(id: string, userId: string) {
  const quizzId = parseInt(id);
  if (isNaN(quizzId)) {
    return null;
  }

  const quizz = await db.query.quizzes.findFirst({
    where: and(
      eq(quizzes.id, quizzId),
      eq(quizzes.userId, userId)
    ),
    columns: {
      id: true,
      name: true,
      description: true,
      status: true,
    },
  });

  return quizz;
}

// Оставляем старую функцию для публичного доступа (если нужно в будущем)
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
