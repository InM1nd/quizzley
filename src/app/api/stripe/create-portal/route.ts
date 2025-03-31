import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const authSession = await auth();
    const userId = authSession?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found!" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    let customer;
    if (user?.stripeCustomerId) {
      customer = {
        id: user.stripeCustomerId,
      };
    } else {
      const customerData = {
        metadata: {
          dbId: userId,
        },
        email: user.email || undefined,
        name: user.name || undefined,
      };

      const response = await stripe.customers.create(customerData);
      customer = { id: response.id };

      await db
        .update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, userId));
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${baseUrl}/billing`,
    });

    if (!portalSession?.url) {
      throw new Error("Failed to create portal session URL");
    }

    return new Response(JSON.stringify({ url: portalSession.url }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Portal creation error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to create billing portal",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
