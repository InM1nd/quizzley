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
  console.log("🚀 =================================");
  console.log("🚀 CREATE SUBSCRIPTION CALLED");
  console.log("🚀 stripeCustomerId:", stripeCustomerId);
  console.log("🚀 =================================");

  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, stripeCustomerId),
  });

  if (!user) {
    console.error("❌ User not found for stripe customer:", stripeCustomerId);
    throw new Error(`User not found for stripe customer: ${stripeCustomerId}`);
  }

  console.log("✅ Found user:", user.id, "email:", user.email);

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: "all",
    limit: 1,
  });

  const subscription = subscriptions.data[0];

  if (!subscription) {
    console.error("❌ No subscription found for customer:", stripeCustomerId);
    throw new Error(`No subscription found for customer: ${stripeCustomerId}`);
  }

  console.log("📊 Subscription details:", {
    id: subscription.id,
    status: subscription.status,
    trial_end: subscription.trial_end,
    current_period_end: subscription.current_period_end,
  });

  // Если подписка в триальном периоде
  if (subscription.status === "active") {
    console.log("🎯 Processing active subscription");
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    await db
      .update(users)
      .set({
        premiumExpiresAt: currentPeriodEnd,
        subscribed: true,
      })
      .where(eq(users.id, user.id));

    console.log("✅ Active subscription set until:", currentPeriodEnd);
  } else if (subscription.status === "trialing") {
    console.log(
      "Subscription is in trial period - will be handled by trial_will_end webhook"
    );

    if (subscription.trial_end) {
      const trialEnd = new Date(subscription.trial_end * 1000);

      await db
        .update(users)
        .set({
          premiumExpiresAt: trialEnd,
          subscribed: false, // Триал не является активной подпиской
        })
        .where(eq(users.id, user.id));

      console.log("✅ Trial subscription set until:", trialEnd);
    } else {
      console.log("⚠️ Trial subscription has no trial_end date");
    }
  } else {
    console.log(`⚠️ Unhandled subscription status: ${subscription.status}`);
  }

  revalidatePath("/billing");
  revalidatePath("/dashboard");

  console.log("🏁 CREATE SUBSCRIPTION COMPLETED");
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
  console.log("🔄 Handling trial ending for customer:", stripeCustomerId);

  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, stripeCustomerId),
  });

  if (!user) {
    console.error("❌ User not found for stripe customer:", stripeCustomerId);
    throw new Error(`User not found for stripe customer: ${stripeCustomerId}`);
  }

  console.log("🔄 User found:", user.id, "email:", user.email);

  const currentStatus = await checkPremiumStatus(user.id);

  if (currentStatus.source === "feedback" && currentStatus.isPremium) {
    console.log("✅ User has active feedback premium, keeping it");
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

  console.log("🔄 Updated user:", user.id, "premiumExpiresAt:", trialEnd);

  revalidatePath("/billing");
  revalidatePath("/dashboard");

  console.log("🏁 Trial ending handled for user:", user.id);
}