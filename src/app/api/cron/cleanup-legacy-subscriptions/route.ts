import { db } from "@/db";
import { users, feedbacks } from "@/db/schema";
import { and, eq, isNull, or, lt } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    console.log("🧹 Запуск очистки legacy подписок");

    // Находим пользователей с subscribed=true но без stripeCustomerId
    // и без активных feedback премиумов
    const currentDate = new Date();

    const legacyUsers = await db.query.users.findMany({
      where: and(eq(users.subscribed, true), isNull(users.stripeCustomerId)),
      columns: {
        id: true,
        email: true,
        subscribed: true,
        createdAt: true,
      },
    });

    console.log(
      `📊 Найдено ${legacyUsers.length} пользователей с legacy подписками`
    );

    let cleanedCount = 0;

    for (const user of legacyUsers) {
      // Проверяем, есть ли у пользователя активный feedback премиум
      const activeFeedback = await db.query.feedbacks.findFirst({
        where: and(
          eq(feedbacks.userId, user.id),
          eq(feedbacks.premiumGranted, true),
          lt(feedbacks.premiumEndDate!, currentDate)
        ),
      });

      // Если нет активного feedback премиума, отключаем legacy подписку
      if (!activeFeedback) {
        await db
          .update(users)
          .set({ subscribed: false })
          .where(eq(users.id, user.id));

        console.log(
          `✅ Отключена legacy подписка для пользователя: ${user.email}`
        );
        cleanedCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalLegacyUsers: legacyUsers.length,
        cleanedCount,
        message: `Обработано ${cleanedCount} legacy подписок`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Ошибка при очистке legacy подписок:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
      }),
      { status: 500 }
    );
  }
}
