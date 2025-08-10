"use client";

import { ChevronsUp, Lock, Gift, Clock } from "lucide-react";
import { getStripe } from "@/lib/stripe-client";
import { Button } from "@/components/ui/button";
import { PRICE_ID } from "@/lib/utils";

interface UpgradePlanProps {
  showFeedbackOption?: boolean;
}

const UpgradePlan = ({ showFeedbackOption = true }: UpgradePlanProps) => {
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

  const onNavigateToFeedback = () => {
    window.location.href = "/feedback";
  };

  return (
    <div className="bg-zinc-900/50 p-8 rounded-2xl backdrop-blur-sm ring-1 ring-white/10">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Unlock Document Upload
          </h2>
          <p className="text-gray-400 max-w-md">
            Upload documents to create personalized quizzes and unlock advanced
            features
          </p>
        </div>

        {/* Способы получения доступа */}
        <div className="w-full flex flex-col items-center gap-4">
          <Button
            variant="default"
            onClick={() => onNavigateToUpgrade(PRICE_ID)}
            size={"lg"}
            className="mt-4 py-6 px-8 rounded-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-orange-600/90 shadow-xl shadow-primary/25 hover:shadow-primary/40 text-lg font-bold border-0 relative overflow-hidden group"
          >
            <ChevronsUp className="w-4 h-4 mr-2" />
            Get Premium - 30 Days
          </Button>

          {showFeedbackOption && (
            <Button
              onClick={onNavigateToFeedback}
              variant="outline"
              size={"lg"}
              className="py-6 px-8 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 transition-all duration-300 text-lg font-bold"
            >
              <Gift className="w-4 h-4 mr-2" />
              Leave Feedback - Get 5 Days Free
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;