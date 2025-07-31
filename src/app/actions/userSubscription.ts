import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  grantSubscriptionPremium,
  checkPremiumStatus,
} from "@/lib/premium-manager";

export async function createSubscription({
  stripeCustomerId,
}: {
  stripeCustomerId: string;
}) {
  console.log("🚀 =================================");
  console.log("🚀 CREATE SUBSCRIPTION CALLED");
  console.log("🚀 stripeCustomerId:", stripeCustomerId);
  console.log("🚀 =================================");

  console.log("🔍 Looking for user with stripeCustomerId:", stripeCustomerId);

  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, stripeCustomerId),
  });

  if (!user) {
    console.error("❌ User not found for stripe customer:", stripeCustomerId);
    throw new Error(`User not found for stripe customer: ${stripeCustomerId}`);
  }

  console.log("✅ Found user:", user.id, "email:", user.email);

  // ✅ Проверяем текущий статус премиума
  const currentStatus = await checkPremiumStatus(user.id);
  console.log(
    "📊 CURRENT PREMIUM STATUS:",
    JSON.stringify(currentStatus, null, 2)
  );

  try {
    console.log("🎯 Calling grantSubscriptionPremium...");
    const result = await grantSubscriptionPremium(user.id);
    console.log("✅ Premium granted until:", result);

    // ✅ Проверяем новый статус после обновления
    console.log("🔄 Checking new status after update...");
    const newStatus = await checkPremiumStatus(user.id);

    console.log("🎉 =================================");
    console.log("🎉 NEW STATUS AFTER UPDATE:");
    console.log("🎉 =================================");
    console.log(JSON.stringify(newStatus, null, 2));
    console.log("🎉 =================================");

    // Дополнительная проверка базы данных
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    console.log("💾 DATABASE CHECK:");
    console.log("💾 premiumExpiresAt:", updatedUser?.premiumExpiresAt);
    console.log("💾 subscribed:", updatedUser?.subscribed);
    console.log("💾 stripeCustomerId:", updatedUser?.stripeCustomerId);
  } catch (error) {
    console.error("❌ Error granting premium:", error);
    throw error;
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