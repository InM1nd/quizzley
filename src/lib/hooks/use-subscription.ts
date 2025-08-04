"use client";

import { useState, useEffect } from "react";
import { getStripe } from "@/lib/stripe-client";
import { useRouter } from "next/navigation";
import { PRICE_ID } from "@/lib/utils";

interface PremiumStatus {
  isPremium: boolean;
  expiresAt: Date | null;
  daysRemaining: number;
  source: "trial" | "feedback" | "subscription" | "expired";
}

interface UseSubscriptionReturn {
  upgradeLoading: boolean;
  error: string | null;
  premiumStatus: PremiumStatus | null;
  isLoadingStatus: boolean;
  handleUpgrade: () => Promise<void>;
}

export function useSubscription(userId?: string): UseSubscriptionReturn {
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(
    null
  );
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const router = useRouter();

  // Загружаем статус подписки при инициализации
  useEffect(() => {
    async function fetchPremiumStatus() {
      if (!userId) {
        setIsLoadingStatus(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/user/subscription-status?userId=${userId}`
        );
        if (response.ok) {
          const status = await response.json();
          setPremiumStatus(status);
        } else {
          console.error("Failed to fetch premium status");
        }
      } catch (error) {
        console.error("Error fetching premium status:", error);
      } finally {
        setIsLoadingStatus(false);
      }
    }

    fetchPremiumStatus();
  }, [userId]);

  const handleUpgrade = async () => {
    if (!userId) {
      const callbackUrl = `/billing/subscribe?price=${encodeURIComponent(
        PRICE_ID
      )}`;
      router.push(
        `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
      );
      return;
    }

    // Проверяем, есть ли уже активная подписка
    if (premiumStatus?.isPremium) {
      setError("У вас уже есть активная подписка Premium");
      return;
    }

    setUpgradeLoading(true);
    setError(null);

    try {
      console.log("🛒 Creating checkout session with PRICE_ID:", PRICE_ID);

      const response = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: PRICE_ID }),
      });

      // ✅ Получаем подробную информацию об ошибке
      const responseText = await response.text();
      console.log("📝 Raw response:", responseText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = JSON.parse(responseText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`;
          }
        } catch (parseError) {
          console.error("❌ Failed to parse error response:", parseError);
          errorMessage += ` - Raw response: ${responseText}`;
        }

        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse success response:", parseError);
        throw new Error("Invalid response format from server");
      }

      const { sessionId } = data;

      if (!sessionId) {
        throw new Error("No session ID received from server");
      }

      console.log("✅ Received session ID:", sessionId);

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      console.log("🔄 Redirecting to Stripe checkout...");
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(`Stripe error: ${stripeError.message}`);
      }
    } catch (error) {
      console.error("❌ Error creating checkout session:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setUpgradeLoading(false);
    }
  };

  return {
    upgradeLoading,
    error,
    premiumStatus,
    isLoadingStatus,
    handleUpgrade,
  };
}
