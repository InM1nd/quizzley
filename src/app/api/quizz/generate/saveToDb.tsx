import { db } from "@/db";
import {
  quizzes,
  questions as dbQuestions,
  questionAnswers,
  quizzStatusEnum,
} from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

type Quizz = InferInsertModel<typeof quizzes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof questionAnswers>;

export interface QuizzQuestion extends Question {
  answers: Answer[];
}

interface SaveQuizzData extends Quizz {
  questions: Array<Question & { answers?: Answer[] }>;
  status?: "processing" | "completed" | "error";
}

export default async function saveQuizz(quizzData: SaveQuizzData) {
  try {
    const { name, description, questions, id, status } = quizzData;

    // Если передан ID, обновляем существующий квиз
    if (id) {
      // Сначала удаляем все существующие вопросы и ответы для этого квиза
      await db.transaction(async (tx) => {
        // Получаем все существующие вопросы для этого квиза
        const existingQuestions = await tx.query.questions.findMany({
          where: eq(dbQuestions.quizzId, id),
          columns: {
            id: true,
          },
        });

        // Удаляем все ответы для каждого вопроса
        for (const question of existingQuestions) {
          await tx
            .delete(questionAnswers)
            .where(eq(questionAnswers.questionId, question.id));
        }

        // Удаляем все вопросы квиза
        await tx.delete(dbQuestions).where(eq(dbQuestions.quizzId, id));

        // Обновляем информацию о квизе
        await tx
          .update(quizzes)
          .set({
            name,
            description,
            status: status || "completed",
          })
          .where(eq(quizzes.id, id));

        // Добавляем новые вопросы и ответы
        for (const question of questions) {
          const [{ questionId }] = await tx
            .insert(dbQuestions)
            .values({ questionText: question.questionText, quizzId: id })
            .returning({ questionId: dbQuestions.id });

          if (question.answers && question.answers.length > 0) {
            await tx.insert(questionAnswers).values(
              question.answers.map((answer) => ({
                answerText: answer.answerText,
                isCorrect: answer.isCorrect,
                questionId,
              }))
            );
          }
        }
      });

      return { quizzId: id };
    } else {
      // Создаем новый квиз
      const newQuizz = await db
        .insert(quizzes)
        .values({
          name,
          description,
          status: status || "completed",
        })
        .returning({ insertedId: quizzes.id });

      const quizzId = newQuizz[0].insertedId;

      if (!quizzId || isNaN(quizzId)) {
        throw new Error("Failed to generate valid quiz ID");
      }

      await db.transaction(async (tx) => {
        for (const question of questions) {
          const [{ questionId }] = await tx
            .insert(dbQuestions)
            .values({ questionText: question.questionText, quizzId })
            .returning({ questionId: dbQuestions.id });

          if (question.answers && question.answers.length > 0) {
            await tx.insert(questionAnswers).values(
              question.answers.map((answer) => ({
                answerText: answer.answerText,
                isCorrect: answer.isCorrect,
                questionId,
              }))
            );
          }
        }
      });

      return { quizzId };
    }
  } catch (error) {
    console.error("Error saving quiz:", error);
    throw error;
  }
}
