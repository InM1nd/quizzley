import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  createSubscription,
  deleteSubscription,
} from "@/app/actions/userSubscription";
import { revalidatePath } from "next/cache";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded", // ✅ Добавляем для recurring payments
]);

export async function POST(req: Request) {
  try {
    console.log("🔔 Webhook called");
    const body = await req.text();
    console.log("📨 Request body received, length:", body.length);

    const sig = req.headers.get("stripe-signature");
    console.log("🔐 Stripe signature:", sig ? "Present" : "Missing");

    const webhookSecret =
      process.env.NODE_ENV === "production"
        ? process.env.STRIPE_WEBHOOK_SECRET
        : process.env.STRIPE_WEBHOOK_LOCAL_SECRET;

    console.log("🔑 Webhook secret:", webhookSecret ? "Present" : "Missing");
    console.log("🌍 NODE_ENV:", process.env.NODE_ENV);

    if (!webhookSecret) {
      console.error("❌ Stripe webhook secret is not set");
      throw new Error("Stripe webhook secret is not set");
    }

    if (!sig) {
      console.error("❌ No signature found in request");
      throw new Error("No signature found in request");
    }

    console.log("🏗️ Constructing Stripe event...");
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log("📩 Received webhook event:", event.type);
    console.log("🆔 Event ID:", event.id);

    if (relevantEvents.has(event.type)) {
      console.log("✅ Processing event:", event.type);

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;
          console.log("🎯 Checkout session completed:", session.id);
          console.log("🎯 Session mode:", session.mode);
          console.log("🎯 Session customer:", session.customer);
          console.log("🎯 Session payment_status:", session.payment_status);

          if (session.mode === "subscription" && session.customer) {
            console.log("🚀 Processing subscription checkout completion");
            try {
              await createSubscription({
                stripeCustomerId: session.customer as string,
              });
              console.log(
                "✅ Subscription created successfully via checkout.session.completed"
              );
            } catch (error) {
              console.error(
                "❌ Error in createSubscription (checkout completed):",
                error
              );
              throw error;
            }
          } else {
            console.log(
              "⚠️ Skipping checkout - not a subscription or no customer"
            );
          }
          break;

        case "customer.subscription.created":
          const subscription = event.data.object as Stripe.Subscription;
          console.log("📝 Subscription created:", subscription.id);
          console.log("📝 Subscription status:", subscription.status);
          console.log("📝 Subscription customer:", subscription.customer);

          // ✅ Проверяем статус подписки перед обработкой
          if (subscription.status === "active") {
            console.log("🎉 Processing active subscription creation");
            try {
              await createSubscription({
                stripeCustomerId: subscription.customer as string,
              });
              console.log(
                "✅ Subscription created successfully via customer.subscription.created"
              );
            } catch (error) {
              console.error(
                "❌ Error in createSubscription (subscription created):",
                error
              );
              throw error;
            }
          } else {
            console.log(
              `⚠️ Skipping subscription creation - status is ${subscription.status}`
            );
          }
          break;

        case "invoice.payment_succeeded":
          const invoice = event.data.object as Stripe.Invoice;
          console.log("💰 Invoice payment succeeded:", invoice.id);
          console.log("💰 Invoice subscription:", invoice.subscription);
          console.log("💰 Invoice billing_reason:", invoice.billing_reason);
          console.log("💰 Invoice customer:", invoice.customer);

          // ✅ Обрабатываем только recurring payments (не первый платеж)
          if (
            invoice.subscription &&
            invoice.billing_reason === "subscription_cycle" &&
            invoice.customer
          ) {
            console.log("🔄 Processing recurring subscription payment");
            try {
              await createSubscription({
                stripeCustomerId: invoice.customer as string,
              });
              console.log("✅ Recurring subscription payment processed");
            } catch (error) {
              console.error("❌ Error processing recurring payment:", error);
              throw error;
            }
          } else {
            console.log(
              "⚠️ Skipping invoice - not a recurring subscription payment"
            );
          }
          break;

        case "customer.subscription.updated":
          const updatedSubscription = event.data.object as Stripe.Subscription;
          console.log("🔄 Subscription updated:", updatedSubscription.id);
          console.log("🔄 Updated status:", updatedSubscription.status);
          console.log("🔄 Updated customer:", updatedSubscription.customer);

          if (updatedSubscription.status === "active") {
            console.log("✅ Processing subscription reactivation");
            await createSubscription({
              stripeCustomerId: updatedSubscription.customer as string,
            });
            console.log("✅ Subscription reactivated successfully");
          } else if (
            updatedSubscription.status === "canceled" ||
            updatedSubscription.status === "unpaid" ||
            updatedSubscription.status === "incomplete_expired"
          ) {
            console.log("❌ Processing subscription deactivation");
            await deleteSubscription({
              stripeCustomerId: updatedSubscription.customer as string,
            });
            console.log("✅ Subscription deactivated successfully");
          } else {
            console.log(
              `⚠️ Unhandled subscription status: ${updatedSubscription.status}`
            );
          }
          break;

        case "customer.subscription.deleted":
          const deletedSubscription = event.data.object as Stripe.Subscription;
          console.log("🗑️ Subscription deleted:", deletedSubscription.id);
          console.log("🗑️ Deleted customer:", deletedSubscription.customer);

          await deleteSubscription({
            stripeCustomerId: deletedSubscription.customer as string,
          });
          console.log("✅ Subscription deletion processed successfully");
          break;

        default:
          console.log(`❓ Unhandled event type: ${event.type}`);
      }

      // ✅ Обновляем кэш после любого изменения подписки
      revalidatePath("/billing");
      revalidatePath("/dashboard");
      console.log("🔄 Cache revalidated for billing and dashboard pages");
    } else {
      console.log("⚠️ Event type not in relevantEvents:", event.type);
    }

    console.log("✅ Webhook processed successfully");
    return new Response(
      JSON.stringify({ received: true, eventType: event.type }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("💥 Webhook error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return new Response(
      JSON.stringify({
        error: "Webhook handler failed",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}