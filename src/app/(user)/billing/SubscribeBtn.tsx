"use client";

import { Loader2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { cn } from "@/lib/utils";

type Props = {
  userId?: string;
  className?: string;
};

const SubscribeBtn = ({ userId, className }: Props) => {
  const {
    upgradeLoading,
    error,
    premiumStatus,
    isLoadingStatus,
    handleUpgrade,
  } = useSubscription(userId);

  const isPremium = premiumStatus?.isPremium;

  return (
    <div className="space-y-2">
      <Button
        onClick={handleUpgrade}
        disabled={upgradeLoading || isLoadingStatus || isPremium}
        variant="default"
        className={cn(
          "w-full py-6 rounded-2xl text-lg font-bold border-0 relative overflow-hidden group",
          isPremium
            ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-60"
            : "bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-orange-600/90 shadow-xl shadow-primary/25 hover:shadow-primary/40"
        )}
      >
        {upgradeLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : isPremium ? (
          <div className="flex items-center justify-center space-x-2">
            <Crown className="h-4 w-4" />
            <span>Premium Active</span>
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