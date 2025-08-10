"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users, userActivityLogs } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// Обновление времени последнего входа и счетчика входов
export async function updateUserLoginActivity() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Обновляем время последнего входа и увеличиваем счетчик
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        loginCount: sql`${users.loginCount} + 1`,
      })
      .where(eq(users.id, userId));

    // Логируем активность
    await db.insert(userActivityLogs).values({
      userId,
      activityType: "login",
      description: "User logged in",
      metadata: JSON.stringify({
        timestamp: new Date().toISOString(),
        userAgent: "web",
      }),
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update login activity" };
  }
}

// Обновление счетчика созданных квизов
export async function updateQuizCreationActivity() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Увеличиваем счетчик созданных квизов
    await db
      .update(users)
      .set({
        totalQuizzesCreated: sql`${users.totalQuizzesCreated} + 1`,
      })
      .where(eq(users.id, userId));

    // Логируем активность
    await db.insert(userActivityLogs).values({
      userId,
      activityType: "quiz_created",
      description: "User created a new quiz",
      metadata: JSON.stringify({
        timestamp: new Date().toISOString(),
      }),
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update quiz creation activity",
    };
  }
}

// Получение статистики пользователя
export async function getUserActivityStats() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return null;
    }

    return {
      lastLoginAt: user.lastLoginAt,
      loginCount: user.loginCount,
      totalQuizzesCreated: user.totalQuizzesCreated,
      createdAt: user.createdAt,
    };
  } catch (error) {
    return null;
  }
}

// Получение истории активности пользователя
export async function getUserActivityHistory(limit = 10) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  try {
    const activities = await db.query.userActivityLogs.findMany({
      where: eq(userActivityLogs.userId, userId),
      orderBy: (userActivityLogs, { desc }) => [
        desc(userActivityLogs.createdAt),
      ],
      limit,
    });

    return activities;
  } catch (error) {
    return [];
  }
}
