import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  createSubscription,
  deleteSubscription,
  handleTrialEnding,
} from "@/app/actions/userSubscription";
import { revalidatePath } from "next/cache";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
  "invoice.payment_succeeded",
]);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    const webhookSecret =
      process.env.NODE_ENV === "production"
        ? process.env.STRIPE_WEBHOOK_SECRET
        : process.env.STRIPE_WEBHOOK_LOCAL_SECRET;

    if (!webhookSecret) {
      throw new Error("Stripe webhook secret is not set");
    }

    if (!sig) {
      throw new Error("No signature found in request");
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (relevantEvents.has(event.type)) {
      switch (event.type) {
        case "customer.subscription.trial_will_end":
          const trialEndingSubscription = event.data
            .object as Stripe.Subscription;
          if (trialEndingSubscription.customer) {
            try {
              await handleTrialEnding({
                stripeCustomerId: trialEndingSubscription.customer as string,
                trialEndDate: trialEndingSubscription.trial_end,
              });
            } catch (error) {
              throw error;
            }
          }
          break;

        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.mode === "subscription" && session.customer) {
            try {
              await createSubscription({
                stripeCustomerId: session.customer as string,
              });
            } catch (error) {
              throw error;
            }
          }
          break;

        case "customer.subscription.created":
          const createdSubscription = event.data.object as Stripe.Subscription;
          if (createdSubscription.customer) {
            try {
              await createSubscription({
                stripeCustomerId: createdSubscription.customer as string,
              });
            } catch (error) {
              throw error;
            }
          }
          break;

        case "invoice.payment_succeeded":
          const invoice = event.data.object as Stripe.Invoice;
          if (invoice.subscription && invoice.customer) {
            try {
              await createSubscription({
                stripeCustomerId: invoice.customer as string,
              });
            } catch (error) {
              throw error;
            }
          }
          break;

        case "customer.subscription.updated":
          const updatedSubscription = event.data.object as Stripe.Subscription;
          if (updatedSubscription.customer) {
            if (updatedSubscription.status === "active") {
              try {
                await createSubscription({
                  stripeCustomerId: updatedSubscription.customer as string,
                });
              } catch (error) {
                throw error;
              }
            } else if (updatedSubscription.status === "canceled") {
              try {
                await deleteSubscription({
                  stripeCustomerId: updatedSubscription.customer as string,
                });
              } catch (error) {
                throw error;
              }
            }
          }
          break;

        case "customer.subscription.deleted":
          const deletedSubscription = event.data.object as Stripe.Subscription;
          if (deletedSubscription.customer) {
            try {
              await deleteSubscription({
                stripeCustomerId: deletedSubscription.customer as string,
              });
            } catch (error) {
              throw error;
            }
          }
          break;
      }

      revalidatePath("/billing");
      revalidatePath("/dashboard");
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Webhook error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 400,
      }
    );
  }
}