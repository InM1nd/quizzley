import { db } from "@/db";
import { feedbacks, users } from "@/db/schema";
import { eq, lt } from "drizzle-orm";

export async function checkPremiumStatus(userId: string) {
  try {
    // Проверяем наличие истекших временных премиумов
    const expiredFeedbacks = await db.query.feedbacks.findMany({
      where: (f) =>
        eq(f.userId, userId) &&
        eq(f.premiumGranted, true) &&
        lt(f.premiumEndDate, new Date()),
    });

    // Если есть истекшие временные премиумы, отключаем их
    if (expiredFeedbacks.length > 0) {
      for (const feedback of expiredFeedbacks) {
        await db
          .update(feedbacks)
          .set({ premiumGranted: false })
          .where(eq(feedbacks.id, feedback.id));
      }

      // Проверяем, есть ли у пользователя постоянная подписка Stripe
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (user?.stripeCustomerId) {
        // Проверяем активные подписки в Stripe
        const { stripe } = await import("@/lib/stripe");
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: "active",
        });

        // Если активных подписок нет, отключаем премиум
        if (subscriptions.data.length === 0) {
          await db
            .update(users)
            .set({ subscribed: false })
            .where(eq(users.id, userId));
          return false;
        }
        return true;
      } else {
        // Если нет Stripe-подписки, отключаем премиум
        await db
          .update(users)
          .set({ subscribed: false })
          .where(eq(users.id, userId));
        return false;
      }
    }

    // Проверяем текущее состояние подписки пользователя
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    return !!user?.subscribed;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
}
