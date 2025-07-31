"use server";

import { db } from "@/db";
import { feedbacks } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { grantFeedbackPremium } from "@/lib/premium-manager";

type FeedbackData = {
  rating: string;
  feedback: string;
};

export async function saveFeedback(feedbackData: FeedbackData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;
    const userName = session?.user?.name;

    if (!userId || !userEmail) {
      return { success: false, message: "User not authenticated" };
    }

    // Проверка на ранее отправленные отзывы (предотвращение абуза)
    const existingFeedback = await db.query.feedbacks.findFirst({
      where: and(
        eq(feedbacks.userId, userId),
        gt(feedbacks.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // 30 дней
      ),
    });

    if (existingFeedback) {
      return {
        success: false,
        message:
          "You've already submitted feedback recently. Thank you for your input!",
      };
    }

    // Сохраняем отзыв в базу данных
    const [savedFeedback] = await db
      .insert(feedbacks)
      .values({
        userId,
        name: userName || "User",
        email: userEmail,
        rating: feedbackData.rating,
        feedback: feedbackData.feedback,
        // Пока не устанавливаем premiumGranted и premiumEndDate
        // Это сделает функция grantFeedbackPremium
      })
      .returning({ id: feedbacks.id });

    if (!savedFeedback) {
      return { success: false, message: "Failed to save feedback" };
    }

    // Используем новую накапливающуюся систему - добавляем 5 дней премиума
    try {
      const newExpirationDate = await grantFeedbackPremium(
        userId,
        savedFeedback.id
      );

      revalidatePath("/feedback");
      revalidatePath("/billing");
      revalidatePath("/dashboard");

      return {
        success: true,
        premiumGranted: true,
        message:
          "Thank you for your feedback! You've been granted 5 days of premium access.",
        expirationDate: newExpirationDate,
      };
    } catch (premiumError) {
      console.error("Error granting premium for feedback:", premiumError);

      // Отзыв сохранен, но премиум не добавлен
      return {
        success: true,
        premiumGranted: false,
        message:
          "Thank you for your feedback! However, there was an issue with granting premium access.",
      };
    }
  } catch (error) {
    console.error("Error saving feedback:", error);
    return {
      success: false,
      message: "An error occurred while saving feedback",
    };
  }
}

// Функция для получения статистики отзывов (опционально)
export async function getFeedbackStats(userId: string) {
  try {
    const feedbackCount = await db.query.feedbacks.findMany({
      where: eq(feedbacks.userId, userId),
    });

    const recentFeedback = await db.query.feedbacks.findFirst({
      where: and(
        eq(feedbacks.userId, userId),
        gt(feedbacks.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      ),
    });

    return {
      totalFeedbacks: feedbackCount.length,
      canSubmitFeedback: !recentFeedback,
      daysUntilNextFeedback: recentFeedback
        ? Math.ceil(
            (30 * 24 * 60 * 60 * 1000 -
              (Date.now() - recentFeedback.createdAt.getTime())) /
              (24 * 60 * 60 * 1000)
          )
        : 0,
    };
  } catch (error) {
    console.error("Error getting feedback stats:", error);
    return {
      totalFeedbacks: 0,
      canSubmitFeedback: false,
      daysUntilNextFeedback: 30,
    };
  }
}