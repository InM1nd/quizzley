// src/app/api/cron/check-premium/route.ts
import { db } from "@/db";
import { feedbacks, users } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";

export async function GET(req: Request) {
  // Простая защита от несанкционированного доступа (можно улучшить)
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. Находим все истекшие фидбек-премиумы
    const expiredFeedbacks = await db.query.feedbacks.findMany({
      where: and(
        eq(feedbacks.premiumGranted, true),
        lt(feedbacks.premiumEndDate, new Date())
      ),
    });

    // 2. Отмечаем их как неактивные
    for (const feedback of expiredFeedbacks) {
      await db
        .update(feedbacks)
        .set({ premiumGranted: false })
        .where(eq(feedbacks.id, feedback.id));
    }

    // 3. Для каждого пользователя с истекшим премиумом
    const affectedUsers = [
      ...new Set(expiredFeedbacks.map((f) => f.userId)),
    ].filter(Boolean);

    for (const userId of affectedUsers) {
      if (!userId) continue;

      // 4. Проверяем, есть ли у пользователя другие активные премиумы
      const activeUserFeedbacks = await db.query.feedbacks.findMany({
        where: and(
          eq(feedbacks.userId, userId),
          eq(feedbacks.premiumGranted, true)
        ),
      });

      // 5. Если нет активных премиумов, проверяем Stripe подписку
      if (activeUserFeedbacks.length === 0) {
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!user) continue;

        if (user.stripeCustomerId) {
          // Проверяем активные подписки в Stripe
          const { stripe } = await import("@/lib/stripe");
          const subscriptions = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: "active",
          });

          // Если нет активных подписок в Stripe, отключаем премиум
          if (subscriptions.data.length === 0) {
            await db
              .update(users)
              .set({ subscribed: false })
              .where(eq(users.id, userId));
          }
        } else {
          // Если нет Stripe ID, просто отключаем премиум
          await db
            .update(users)
            .set({ subscribed: false })
            .where(eq(users.id, userId));
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: expiredFeedbacks.length,
        affectedUsers: affectedUsers.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error checking premium status:", error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
