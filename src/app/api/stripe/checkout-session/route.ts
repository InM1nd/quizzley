import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { checkPremiumStatus } from "@/lib/premium-manager";

export async function POST(req: Request) {
  try {
    console.log("🛒 Creating checkout session...");

    const { price, quantity = 1 } = await req.json();
    console.log("📦 Price ID:", price, "Quantity:", quantity);

    const userSession = await auth();
    const userId = userSession?.user?.id;

    if (!userId) {
      console.error("❌ User not authenticated");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    console.log("👤 User ID:", userId);

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      console.error("❌ User not found in database:", userId);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    console.log("✅ Found user:", user.email);

    // ✅ ПРОВЕРКА АКТИВНОЙ ПОДПИСКИ
    console.log("🔍 Checking premium status...");
    const premiumStatus = await checkPremiumStatus(userId);
    console.log(
      "📊 Current premium status:",
      JSON.stringify(premiumStatus, null, 2)
    );

    // ✅ Если у пользователя уже есть активная подписка, запрещаем создание новой
    if (premiumStatus.isPremium && premiumStatus.source === "subscription") {
      console.log("❌ User already has active subscription - BLOCKING");
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
      console.log("❌ User is already subscribed in database - BLOCKING");
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

    console.log("✅ Subscription check passed - proceeding with checkout");

    let customer;

    if (user?.stripeCustomerId) {
      console.log(
        "🔍 Checking existing Stripe customer:",
        user.stripeCustomerId
      );

      try {
        // ✅ Проверяем, существует ли customer в Stripe
        const existingCustomer = await stripe.customers.retrieve(
          user.stripeCustomerId
        );

        if (existingCustomer.deleted) {
          console.log("⚠️ Customer was deleted, creating new one");
          throw new Error("Customer was deleted");
        }

        console.log(
          "✅ Using existing valid Stripe customer:",
          user.stripeCustomerId
        );
        customer = { id: user.stripeCustomerId };
      } catch (stripeError) {
        console.log("❌ Existing customer not found or invalid:", stripeError);
        console.log("🆕 Creating new Stripe customer...");

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

        console.log("✅ Created new Stripe customer:", customer.id);

        // ✅ Обновляем базу данных с новым customer ID
        await db
          .update(users)
          .set({ stripeCustomerId: customer.id })
          .where(eq(users.id, userId));

        console.log("✅ Updated user with new Stripe customer ID");
      }
    } else {
      console.log("🆕 Creating new Stripe customer (no existing ID)...");
      const customerData = {
        email: user.email || undefined,
        name: user.name || undefined,
        metadata: {
          dbId: userId,
        },
      };

      const response = await stripe.customers.create(customerData);
      customer = { id: response.id };
      console.log("✅ Created Stripe customer:", customer.id);

      await db
        .update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, userId));

      console.log("✅ Updated user with Stripe customer ID");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    console.log("🌐 Base URL:", baseUrl);

    console.log("🎫 Creating Stripe checkout session with:");
    console.log("- Customer:", customer.id);
    console.log("- Price:", price);
    console.log("- Success URL:", `${baseUrl}/billing/payment/success`);

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
      console.log("✅ Checkout session created:", session.id);
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
      console.error("❌ No session ID returned from Stripe");
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
    console.error("❌ General error in checkout session:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

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
