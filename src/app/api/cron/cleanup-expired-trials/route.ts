import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    console.log("🧹 Starting cleanup of expired trials");

    const currentDate = new Date();

    // Находим пользователей с истекшими пробными периодами
    const expiredTrialUsers = await db.query.users.findMany({
      where: and(
        eq(users.trialPremium, true),
        lt(users.trialPremiumEndDate, currentDate)
      ),
      columns: {
        id: true,
        email: true,
        trialPremiumEndDate: true,
      },
    });

    console.log(
      `📊 Found ${expiredTrialUsers.length} users with expired trials`
    );

    if (expiredTrialUsers.length > 0) {
      // Отключаем истекшие пробные периоды
      const updateResult = await db
        .update(users)
        .set({ trialPremium: false })
        .where(
          and(
            eq(users.trialPremium, true),
            lt(users.trialPremiumEndDate, currentDate)
          )
        )
        .returning({ id: users.id, email: users.email });

      console.log(
        "✅ Disabled trials for users:",
        updateResult.map((u) => u.email)
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: expiredTrialUsers.length,
        expiredUsers: expiredTrialUsers.map((u) => ({
          id: u.id,
          email: u.email,
          expiredDate: u.trialPremiumEndDate,
        })),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error cleaning up expired trials:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
      }),
      {
        status: 500,
      }
    );
  }
}
