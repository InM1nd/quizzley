import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { checkPremiumStatus } from "@/lib/premium-manager";

export async function POST(req: Request) {
  try {
    const { price, quantity = 1 } = await req.json();

    const userSession = await auth();
    const userId = userSession?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // ✅ ПРОВЕРКА АКТИВНОЙ ПОДПИСКИ
    const premiumStatus = await checkPremiumStatus(userId);

    // ✅ Если у пользователя уже есть активная подписка, запрещаем создание новой
    if (premiumStatus.isPremium && premiumStatus.source === "subscription") {
      return new Response(
        JSON.stringify({
          error: "You already have an active subscription",
          details:
            "Cannot create a new subscription while current one is active",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ✅ Дополнительная проверка: если пользователь уже подписан в базе данных
    if (user.subscribed) {
      return new Response(
        JSON.stringify({
          error: "You already have an active subscription",
          details: "Your subscription is already active in our system",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    let customer;

    if (user?.stripeCustomerId) {
      try {
        // ✅ Проверяем, существует ли customer в Stripe
        const existingCustomer = await stripe.customers.retrieve(
          user.stripeCustomerId
        );

        if (existingCustomer.deleted) {
          throw new Error("Customer was deleted");
        }

        customer = { id: user.stripeCustomerId };
      } catch (stripeError) {
        // Создаем нового customer'а
        const customerData = {
          email: user.email || undefined,
          name: user.name || undefined,
          metadata: {
            dbId: userId,
          },
        };

        const newCustomer = await stripe.customers.create(customerData);
        customer = { id: newCustomer.id };

        // ✅ Обновляем базу данных с новым customer ID
        await db
          .update(users)
          .set({ stripeCustomerId: customer.id })
          .where(eq(users.id, userId));
      }
    } else {
      const customerData = {
        email: user.email || undefined,
        name: user.name || undefined,
        metadata: {
          dbId: userId,
        },
      };

      const response = await stripe.customers.create(customerData);
      customer = { id: response.id };

      await db
        .update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, userId));
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      success_url: `${baseUrl}/billing/payment/success`,
      cancel_url: `${baseUrl}/billing`,
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [{ price, quantity }],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 3, // 3 days trial
      },
      metadata: {
        userId: userId,
      },
    });

    if (session?.id) {
      return new Response(
        JSON.stringify({
          sessionId: session.id,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          error: "Failed to create checkout session - no session ID",
        }),
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
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
