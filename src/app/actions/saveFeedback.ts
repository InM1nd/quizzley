"use server";

import { db } from "@/db";
import { feedbacks, users } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";

type FeedbackData = {
  rating: string;
  feedback: string;
};

export async function saveFeedback(data: FeedbackData) {
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
        rating: data.rating,
        feedback: data.feedback,
        premiumGranted: true,
        // Дата окончания премиума (2 недели от текущей даты)
        premiumEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      })
      .returning();

    if (!savedFeedback) {
      return { success: false, message: "Failed to save feedback" };
    }

    // Получаем информацию о пользователе
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Если пользователь уже имеет активную подписку,
    // добавляем 2 недели к текущей дате окончания подписки
    if (user.subscribed && savedFeedback.premiumEndDate) {
      const newPremiumEndDate = new Date(savedFeedback.premiumEndDate);
      newPremiumEndDate.setDate(newPremiumEndDate.getDate() + 14);

      await db
        .update(feedbacks)
        .set({
          premiumEndDate: newPremiumEndDate,
        })
        .where(eq(feedbacks.id, savedFeedback.id));

      return {
        success: true,
        premiumGranted: false,
        message:
          "Thank you for your feedback! Your subscription has been extended by 2 weeks.",
      };
    }

    // Иначе - активируем премиум через подписку пользователя
    await db
      .update(users)
      .set({ subscribed: true })
      .where(eq(users.id, userId));

    revalidatePath("/");
    return { success: true, premiumGranted: true };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return {
      success: false,
      message: "An error occurred while saving feedback",
    };
  }
}

// Функция для создания задачи, которая отключит премиум через 14 дней
async function createPremiumExpiration(userId: string, feedbackId: number) {
  // В реальном проекте здесь можно использовать Cron-задачи
  // или специальные сервисы для планирования задач
  // Для простоты можно использовать базу данных и проверять срок действия при каждом запросе
  // Но более надежным решением будет использование внешнего сервиса планирования задач
  // или серверных функций, запускаемых по расписанию (например, Vercel Cron Jobs)
}
