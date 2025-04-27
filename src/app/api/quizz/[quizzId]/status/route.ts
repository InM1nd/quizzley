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
      columns: {
        id: true,
        name: true,
        description: true,
        status: true,
      },
    });

    if (!quizz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: quizz.id,
      status: quizz.status,
      message: quizz.description,
    });
  } catch (error: any) {
    console.error("Error getting quiz status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
