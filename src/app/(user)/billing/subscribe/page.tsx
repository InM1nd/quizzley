"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getStripe } from "@/lib/stripe-client";
import { PRICE_ID } from "@/lib/utils";

const SubscribePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const price = searchParams.get("price") || "price_1OqX8X2eZvKYlo2C9Q9Q9Q9Q";

  useEffect(() => {
    const createStripeSession = async () => {
      try {
        const { sessionId } = await fetch("/api/stripe/checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price }),
        }).then((res) => res.json());

        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });
      } catch (error) {
        console.log("Error creating session:", error);
        router.push("/dashboard?error=subscription_failed");
      }
    };

    // Создаем Stripe сессию сразу при загрузке страницы
    createStripeSession();
  }, [price, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-white text-lg">Redirecting to payment...</p>
      </div>
    </div>
  );
};

export default SubscribePage;
