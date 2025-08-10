import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkQuizCreationLimit } from "@/lib/usage-limits";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const usageLimits = await checkQuizCreationLimit(userId);
    return NextResponse.json(usageLimits);
  } catch (error) {
    console.error("Error fetching usage limits:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage limits" },
      { status: 500 }
    );
  }
}
