import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkQuizCreationLimit } from "@/lib/usage-limits";
import { getPremiumStatus } from "@/app/actions/userSubscription";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Получаем данные параллельно для оптимизации
    const [usageLimits, subscriptionStatus] = await Promise.all([
      checkQuizCreationLimit(userId),
      getPremiumStatus(userId),
    ]);

    return NextResponse.json({
      usageLimits,
      subscriptionStatus,
      user: {
        id: userId,
        email: session.user?.email,
        name: session.user?.name,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
