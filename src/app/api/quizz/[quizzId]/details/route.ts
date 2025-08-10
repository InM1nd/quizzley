import { NextRequest, NextResponse } from "next/server";
import { getQuizzByIdForUser } from "@/lib/quizz";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ quizzId: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const quizz = await getQuizzByIdForUser(resolvedParams.quizzId, userId);

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
