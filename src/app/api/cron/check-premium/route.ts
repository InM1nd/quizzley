import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { lt } from "drizzle-orm";

export async function GET() {
  try {
    const now = new Date();

    // Обновляем статус подписки для истекших премиумов
    const result = await db
      .update(users)
      .set({ subscribed: false })
      .where(lt(users.premiumExpiresAt, now));

    const updatedCount = result.length;

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} expired premium subscriptions`,
    });
  } catch (error) {
    console.error("Error cleaning up expired premium:", error);
    return NextResponse.json(
      { error: "Failed to cleanup expired premium" },
      { status: 500 }
    );
  }
}
