import { db } from "@/db";
import { users, feedbacks } from "@/db/schema";
import { eq, and, isNull, lt, gt } from "drizzle-orm";

export interface PremiumStatus {
  isPremium: boolean;
  expiresAt: Date | null;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  source: "trial" | "feedback" | "subscription" | "expired";
}

export async function checkPremiumStatus(
  userId: string
): Promise<PremiumStatus> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const expiresAt = user.premiumExpiresAt;

    if (!expiresAt) {
      return {
        isPremium: false,
        expiresAt: null,
        daysRemaining: 0,
        hoursRemaining: 0,
        minutesRemaining: 0,
        source: "expired",
      };
    }

    const isPremium = expiresAt > now;

    let daysRemaining = 0;
    let hoursRemaining = 0;
    let minutesRemaining = 0;

    if (isPremium) {
      const timeRemaining = expiresAt.getTime() - now.getTime();
      const totalMinutes = Math.floor(timeRemaining / (1000 * 60));

      daysRemaining = Math.floor(totalMinutes / (24 * 60));
      hoursRemaining = Math.floor((totalMinutes % (24 * 60)) / 60);
      minutesRemaining = totalMinutes % 60;
    }

    // Определяем источник премиума
    let source: PremiumStatus["source"] = "expired";
    if (isPremium) {
      if (user.stripeCustomerId && user.subscribed) {
        source = "subscription";
      } else if (user.stripeCustomerId && !user.subscribed) {
        const activeFeedback = await db.query.feedbacks.findFirst({
          where: and(
            eq(feedbacks.userId, userId),
            eq(feedbacks.premiumGranted, true),
            gt(feedbacks.premiumEndDate, now)
          ),
        });
        source = activeFeedback ? "feedback" : "trial";
      } else {
        // Проверяем, есть ли активный feedback premium
        const activeFeedback = await db.query.feedbacks.findFirst({
          where: and(
            eq(feedbacks.userId, userId),
            eq(feedbacks.premiumGranted, true),
            gt(feedbacks.premiumEndDate, now)
          ),
        });
        source = activeFeedback ? "feedback" : "trial";
      }
    }

    return {
      isPremium,
      expiresAt,
      daysRemaining,
      hoursRemaining,
      minutesRemaining,
      source,
    };
  } catch (error) {
    console.error("Error checking premium status:", error);
    return {
      isPremium: false,
      expiresAt: null,
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      source: "expired",
    };
  }
}

/**
 * Добавляет время к премиум подписке (накапливающая логика)
 */
export async function addPremiumTime(
  userId: string,
  days: number,
  reason: string,
  setSubscribed: boolean = false
): Promise<Date> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();
  let newExpirationDate: Date;

  if (user.premiumExpiresAt && user.premiumExpiresAt > now) {
    // Если премиум еще активен, добавляем время к существующей дате
    newExpirationDate = new Date(
      user.premiumExpiresAt.getTime() + days * 24 * 60 * 60 * 1000
    );
  } else {
    // Если премиум истек или его не было, добавляем время к текущему моменту
    newExpirationDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  }

  await db
    .update(users)
    .set({
      premiumExpiresAt: newExpirationDate,
      subscribed: setSubscribed,
    })
    .where(eq(users.id, userId));

  console.log(
    `Added ${days} days of premium to user ${userId}. Reason: ${reason}. New expiration: ${newExpirationDate}`
  );

  return newExpirationDate;
}

export async function grantFeedbackPremium(
  userId: string,
  feedbackId: number
): Promise<Date> {
  const expirationDate = await addPremiumTime(
    userId,
    5,
    "Feedback reward",
    false
  );

  // Обновляем запись отзыва
  await db
    .update(feedbacks)
    .set({
      premiumGranted: true,
      premiumEndDate: expirationDate,
    })
    .where(eq(feedbacks.id, feedbackId));

  return expirationDate;
}

/**
 * Добавляет месяц премиума за подписку
 */
export async function grantSubscriptionPremium(userId: string): Promise<Date> {
  return await addPremiumTime(userId, 30, "Monthly subscription", true);
}

/**
 * Проверяет и обновляет статус подписки (для cron задач)
 */
export async function cleanupExpiredPremium(): Promise<void> {
  const now = new Date();

  await db
    .update(users)
    .set({ subscribed: false })
    .where(lt(users.premiumExpiresAt, now)); // Здесь нужно использовать lt() для expired
}
