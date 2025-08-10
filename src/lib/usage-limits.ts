import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { checkPremiumStatus } from "./premium-manager";

export interface UsageLimits {
  canCreateQuiz: boolean;
  dailyQuizzesCreated: number;
  dailyQuizzesLimit: number;
  quizzesRemaining: number;
  isPremium: boolean;
}

const FREE_DAILY_QUIZ_LIMIT = 3;

export async function checkQuizCreationLimit(
  userId: string
): Promise<UsageLimits> {
  const premiumStatus = await checkPremiumStatus(userId);

  // Если пользователь премиум, у него нет ограничений
  if (premiumStatus.isPremium) {
    return {
      canCreateQuiz: true,
      dailyQuizzesCreated: 0,
      dailyQuizzesLimit: -1, // -1 означает безлимит
      quizzesRemaining: -1,
      isPremium: true,
    };
  }

  // Для бесплатных пользователей проверяем дневные лимиты
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Сбрасываем счетчик, если это новый день
  if (!user.lastQuizResetDate || user.lastQuizResetDate < today) {
    await db
      .update(users)
      .set({
        dailyQuizzesCreated: 0,
        lastQuizResetDate: today,
      })
      .where(eq(users.id, userId));

    return {
      canCreateQuiz: true,
      dailyQuizzesCreated: 0,
      dailyQuizzesLimit: FREE_DAILY_QUIZ_LIMIT,
      quizzesRemaining: FREE_DAILY_QUIZ_LIMIT,
      isPremium: false,
    };
  }

  const quizzesRemaining =
    FREE_DAILY_QUIZ_LIMIT - (user.dailyQuizzesCreated ?? 0);

  return {
    canCreateQuiz: quizzesRemaining > 0,
    dailyQuizzesCreated: user.dailyQuizzesCreated ?? 0,
    dailyQuizzesLimit: FREE_DAILY_QUIZ_LIMIT,
    quizzesRemaining: Math.max(0, quizzesRemaining),
    isPremium: false,
  };
}

export async function incrementDailyQuizCount(userId: string): Promise<void> {
  await db
    .update(users)
    .set({
      dailyQuizzesCreated: sql`${users.dailyQuizzesCreated} + 1`,
      totalQuizzesCreated: sql`${users.totalQuizzesCreated} + 1`,
    })
    .where(eq(users.id, userId));
}

export async function canAccessQuizSettings(userId: string): Promise<boolean> {
  const premiumStatus = await checkPremiumStatus(userId);
  return premiumStatus.isPremium;
}
