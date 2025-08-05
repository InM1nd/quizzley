"use client";

import { useEffect } from "react";
import { Badge } from "./badge";
import {
  Crown,
  Lock,
  Zap,
  Clock,
  TrendingUp,
  Gift,
  Loader2,
} from "lucide-react";
import { Button } from "./button";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { useUsageLimitsStore } from "@/lib/stores/usage-limits-store";
import { cn } from "@/lib/utils";

interface UsageLimitsDisplayProps {
  userId?: string;
  limits?: any; // Добавляем опциональный проп limits
}

export function UsageLimitsDisplay({
  userId,
  limits: externalLimits,
}: UsageLimitsDisplayProps) {
  const {
    limits: storeLimits,
    isLoading,
    error,
    refreshLimits,
  } = useUsageLimitsStore();
  const {
    upgradeLoading,
    error: subscriptionError,
    premiumStatus,
    isLoadingStatus,
    handleUpgrade,
  } = useSubscription(userId);

  // Используем внешние limits если они переданы, иначе из store
  const limits = externalLimits || storeLimits;

  useEffect(() => {
    if (!externalLimits && userId) {
      refreshLimits();
    }
  }, [userId, refreshLimits, externalLimits]);

  if (isLoading || isLoadingStatus) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse"></div>
        <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!limits) {
    return null;
  }

  // Используем статус из хука подписки, если он доступен
  const isPremium = premiumStatus?.isPremium || limits.isPremium;

  if (isPremium) {
    return (
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
          <Crown className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-green-400">Premium</span>
        </div>
      </div>
    );
  }

  // Вычисляем процент использования
  const usagePercentage =
    (limits.dailyQuizzesCreated / limits.dailyQuizzesLimit) * 100;
  const remainingPercentage =
    (limits.quizzesRemaining / limits.dailyQuizzesLimit) * 100;

  return (
    <div className="flex flex-col items-start gap-4">
      {/* Статус плана */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-full">
        <Lock className="h-4 w-4 text-orange-400" />
        <span className="text-sm font-medium text-orange-400">Free Plan</span>
      </div>

      {/* Прогресс бар с делениями */}
      <div className="flex flex-col gap-2 min-w-[200px]">
        <div className="flex flex-row justify-between items-center gap-1 text-xs text-gray-500">
          <div className="flex flex-row items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Resets daily</span>
          </div>
          <span className="">
            {limits.dailyQuizzesCreated}/{limits.dailyQuizzesLimit}
          </span>
        </div>

        {/* Прогресс бар */}
        <div className="relative w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
          {/* Деления */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: limits.dailyQuizzesLimit }, (_, index) => (
              <div
                key={index}
                className="flex-1 border-r border-zinc-700 last:border-r-0"
              />
            ))}
          </div>

          {/* Заполненная часть */}
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 ease-out"
            style={{ width: `${usagePercentage}%` }}
          />

          {/* Оставшиеся квизы (если есть) */}
          {limits.quizzesRemaining > 0 && (
            <div
              className="h-full bg-gradient-to-r from-green-500/60 to-emerald-500/60 transition-all duration-300 ease-out"
              style={{
                width: `${remainingPercentage}%`,
                marginLeft: `${usagePercentage}%`,
              }}
            />
          )}
        </div>

        {/* Подписи */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-400">Used</span>
          </div>
          {limits.quizzesRemaining > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">Remaining</span>
            </div>
          )}
        </div>
      </div>

      {/* Кнопка апгрейда */}
      {!limits.canCreateQuiz && (
        <div className="space-y-2">
          <Button
            size="lg"
            onClick={handleUpgrade}
            disabled={upgradeLoading || premiumStatus?.isPremium}
            className={cn(
              "text-xs h-8 px-3 rounded-full font-bold border-0 relative overflow-hidden group",
              premiumStatus?.isPremium
                ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-orange-600/90 shadow-lg shadow-primary/25 hover:shadow-primary/40"
            )}
          >
            {upgradeLoading ? (
              <div className="flex items-center justify-center space-x-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : premiumStatus?.isPremium ? (
              <div className="flex items-center justify-center space-x-1">
                <Crown className="h-3 w-3" />
                <span>Premium Active</span>
              </div>
            ) : (
              <>
                <Crown className="h-3 w-3 mr-1" />
                Upgrade
              </>
            )}
          </Button>

          {(error || subscriptionError) && (
            <div className="text-red-500 text-xs text-center p-2 bg-red-50 rounded border border-red-200">
              {error || subscriptionError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
