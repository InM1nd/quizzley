import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quizzes } from "@/db/schema";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ quizzId: string }> }
) {
  const resolvedParams = await params;
  const { quizzId } = resolvedParams;

  if (!quizzId) return NextResponse.json({ error: "No id" }, { status: 400 });

  // Исправление для drizzle-orm - используем eq из drizzle-orm/expressions
  const { eq } = await import("drizzle-orm");
  await db.delete(quizzes).where(eq(quizzes.id, parseInt(quizzId)));

  return NextResponse.json({ success: true });
}
