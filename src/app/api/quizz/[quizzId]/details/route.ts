import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { quizzId: string } }
) {
  try {
    const quizzId = parseInt(params.quizzId);

    if (isNaN(quizzId)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
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
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: quizz.id,
      name: quizz.name,
      description: quizz.description,
      status: quizz.status,
      questions: quizz.questions.map((q) => ({
        id: q.id,
        text: q.questionText,
        answers: q.answers.map((a) => ({
          id: a.id,
          text: a.answerText,
          isCorrect: a.isCorrect,
        })),
      })),
    });
  } catch (error: any) {
    console.error("Error getting quiz details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
