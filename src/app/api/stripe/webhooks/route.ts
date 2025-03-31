import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  createSubscription,
  deleteSubscription,
} from "@/app/actions/userSubscription";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  try {
    console.log("Webhook called");
    const body = await req.text();
    console.log("Request body received");

    const sig = req.headers.get("stripe-signature");
    console.log("Stripe signature:", sig ? "Present" : "Missing");

    const webhookSecret =
      process.env.NODE_ENV === "production"
        ? process.env.STRIPE_WEBHOOK_SECRET
        : process.env.STRIPE_WEBHOOK_LOCAL_SERCRET;

    console.log("Webhook secret:", webhookSecret ? "Present" : "Missing");
    console.log("NODE_ENV:", process.env.NODE_ENV);

    if (!webhookSecret) {
      throw new Error("Stripe webhook secret is not set");
    }

    if (!sig) {
      throw new Error("No signature found in request");
    }

    console.log("Constructing Stripe event...");
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log("Received webhook event:", event.type);

    if (relevantEvents.has(event.type)) {
      console.log("Processing event:", event.type);
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;
          console.log("Checkout session completed:", session.id);
          console.log("Session mode:", session.mode);
          console.log("Session customer:", session.customer);
          if (session.mode === "subscription" && session.customer) {
            console.log(
              "Creating subscription for customer:",
              session.customer
            );
            await createSubscription({
              stripeCustomerId: session.customer as string,
            });
            console.log("Subscription created successfully");
          }
          break;
        case "customer.subscription.created":
          const subscription = event.data.object as Stripe.Subscription;
          console.log(
            "Creating subscription for customer:",
            subscription.customer
          );
          await createSubscription({
            stripeCustomerId: subscription.customer as string,
          });
          console.log("Subscription created successfully");
          break;
        case "customer.subscription.deleted":
          const deletedSubscription = event.data.object as Stripe.Subscription;
          console.log(
            "Deleting subscription for customer:",
            deletedSubscription.customer
          );
          await deleteSubscription({
            stripeCustomerId: deletedSubscription.customer as string,
          });
          console.log("Subscription deleted successfully");
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } else {
      console.log("Event type not in relevantEvents:", event.type);
    }

    console.log("Webhook processed successfully");
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.stack : String(error)
    );
    return new Response(
      JSON.stringify({
        error: "Webhook handler failed",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 400 }
    );
  }
}
