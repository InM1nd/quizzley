"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getStripe } from "@/lib/stripe-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PRICE_ID } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
  userId?: string;
  className?: string;
};

const SubscribeBtn = ({ userId, className }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivatePro = async () => {
    if (!userId) {
      const callbackUrl = `/billing/subscribe?price=${encodeURIComponent(
        PRICE_ID
      )}`;
      router.push(
        `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
      );
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleActivatePro}
        // disabled={loading}
        variant="default"
        className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-orange-600/90 shadow-xl shadow-primary/25 hover:shadow-primary/40 text-lg font-bold border-0 relative overflow-hidden group"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          "Activate Premium"
        )}
      </Button>

      {error && (
        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default SubscribeBtn;