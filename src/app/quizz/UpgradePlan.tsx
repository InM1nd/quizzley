"use client";

import { ChevronsUp, Lock } from "lucide-react";
import { getStripe } from "@/lib/stripe-client";
import { Button } from "@/components/ui/button";
import { PRICE_ID } from "@/lib/utils";

const UpgradePlan = () => {
  const onNavigateToUpgrade = async (price: string) => {
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
      console.log("Subscribe Button error", error);
    }
  };

  return (
    <div className="bg-zinc-900/50 p-8 rounded-2xl backdrop-blur-sm ring-1 ring-white/10">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Unlock Advanced Features
          </h2>
          <p className="text-gray-400 max-w-md">
            Subscribe to access document uploads, personalized quizzes, and more
            advanced features
          </p>
        </div>
        <Button
          onClick={() => onNavigateToUpgrade(PRICE_ID)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <ChevronsUp className="w-4 h-4 mr-2" />
          Upgrade Now
        </Button>
      </div>
    </div>
  );
};

export default UpgradePlan;
