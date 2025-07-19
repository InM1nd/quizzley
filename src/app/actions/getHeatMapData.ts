import { quizzes, quizzSubmitions, questions, users } from "@/db/schema";
import { auth } from "@/auth";
import { avg, count, eq, sql } from "drizzle-orm";
import { db } from "@/db";

const getHeatMapData = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  const data = await db
    .select({
      createdAt: quizzSubmitions.createdAt,
      count: sql<number>`cast(count(${quizzSubmitions.id}) as int)`,
    })
    .from(quizzSubmitions)
    .innerJoin(quizzes, eq(quizzSubmitions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(quizzes.userId, userId))
    .groupBy(quizzSubmitions.createdAt);

  return { data };
};
export default getHeatMapData;
