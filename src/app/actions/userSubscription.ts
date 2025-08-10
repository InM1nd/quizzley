import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  grantSubscriptionPremium,
  checkPremiumStatus,
} from "@/lib/premium-manager";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createSubscription({
  stripeCustomerId,
}: {
  stripeCustomerId: string;
}) {
  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, stripeCustomerId),
  });

  if (!user) {
    throw new Error(`User not found for stripe customer: ${stripeCustomerId}`);
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: "all",
    limit: 1,
  });

  const subscription = subscriptions.data[0];

  if (!subscription) {
    throw new Error(`No subscription found for customer: ${stripeCustomerId}`);
  }

  // Если подписка в триальном периоде
  if (subscription.status === "active") {
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    await db
      .update(users)
      .set({
        premiumExpiresAt: currentPeriodEnd,
        subscribed: true,
      })
      .where(eq(users.id, user.id));
  } else if (subscription.status === "trialing") {
    if (subscription.trial_end) {
      const trialEnd = new Date(subscription.trial_end * 1000);

      await db
        .update(users)
        .set({
          premiumExpiresAt: trialEnd,
          subscribed: false, // Триал не является активной подпиской
        })
        .where(eq(users.id, user.id));
    }
  }

  revalidatePath("/billing");
  revalidatePath("/dashboard");
}

export async function deleteSubscription({
  stripeCustomerId,
}: {
  stripeCustomerId: string;
}) {
  // При отмене подписки НЕ сразу убираем премиум
  // Премиум будет действовать до истечения уже оплаченного времени
  await db
    .update(users)
    .set({
      subscribed: false, // Убираем флаг активной подписки
    })
    .where(eq(users.stripeCustomerId, stripeCustomerId));

  revalidatePath("/billing");
  revalidatePath("/dashboard");
}

export async function getUserSubscription({ userId }: { userId: string }) {
  const status = await checkPremiumStatus(userId);
  return status.isPremium;
}

export async function refreshSubscriptionStatus(userId: string) {
  "use server";

  const status = await checkPremiumStatus(userId);

  revalidatePath("/billing");
  revalidatePath("/dashboard");

  return status;
}

// Новая функция для получения полного статуса
export async function getPremiumStatus(userId: string) {
  "use server";
  return await checkPremiumStatus(userId);
}

export async function handleTrialEnding({
  stripeCustomerId,
  trialEndDate,
}: {
  stripeCustomerId: string;
  trialEndDate: number | null;
}) {
  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, stripeCustomerId),
  });

  if (!user) {
    throw new Error(`User not found for stripe customer: ${stripeCustomerId}`);
  }

  const currentStatus = await checkPremiumStatus(user.id);

  if (currentStatus.source === "feedback" && currentStatus.isPremium) {
    return;
  }

  const trialEnd = trialEndDate ? new Date(trialEndDate * 1000) : null;

  await db
    .update(users)
    .set({
      premiumExpiresAt: trialEnd,
      subscribed: false,
    })
    .where(eq(users.id, user.id));

  revalidatePath("/billing");
  revalidatePath("/dashboard");
}