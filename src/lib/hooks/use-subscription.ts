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
        }
      } catch (error) {
        // Ошибка загрузки статуса подписки
      } finally {
        setIsLoadingStatus(false);
      }
    }

    fetchPremiumStatus();
  }, [userId]);

  const handleUpgrade = async () => {
    if (!userId) {
      // Не делаем перенаправление, просто возвращаем ошибку
      setError("Please sign in to subscribe");
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
      const response = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: PRICE_ID }),
      });

      const responseText = await response.text();

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
          errorMessage += ` - Raw response: ${responseText}`;
        }

        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Invalid response format from server");
      }

      const { sessionId } = data;

      if (!sessionId) {
        throw new Error("No session ID received from server");
      }

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(`Stripe error: ${stripeError.message}`);
      }
    } catch (error) {
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
