import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPremiumStatus } from "@/app/actions/userSubscription";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const premiumStatus = await getPremiumStatus(userId);

    return NextResponse.json(premiumStatus);
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
