"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { getStripe } from "@/lib/stripe-client";
import { PRICE_ID } from "@/lib/utils";

const SubscribePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Используем PRICE_ID вместо hardcoded fallback
  const price = searchParams.get("price") || PRICE_ID;

  useEffect(() => {
    const createStripeSession = async () => {
      try {
        const response = await fetch("/api/stripe/checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to create checkout session"
          );
        }

        const { sessionId } = await response.json();

        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });
      } catch (error) {
        console.log("Error creating session:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        setLoading(false);
      }
    };

    // Создаем Stripe сессию сразу при загрузке страницы
    createStripeSession();
  }, [price, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Subscription Error
          </h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => router.push("/billing")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Billing
          </button>
        </div>
      </div>
    );
  }

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
