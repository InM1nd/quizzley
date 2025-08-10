"use client";

import { useEffect, useState } from "react";
import { Crown, Clock, Sparkles } from "lucide-react";

interface PremiumStatus {
  isPremium: boolean;
  expiresAt: Date | null;
  daysRemaining: number;
  source: "trial" | "feedback" | "subscription" | "expired";
}

interface SubscriptionStatusProps {
  userId?: string;
  status?: PremiumStatus; // Добавляем опциональный проп status
}

const SubscriptionStatus = ({
  userId,
  status: externalStatus,
}: SubscriptionStatusProps) => {
  const [status, setStatus] = useState<PremiumStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Если передан внешний статус, используем его
    if (externalStatus) {
      setStatus(externalStatus);
      setLoading(false);
      return;
    }

    // Иначе загружаем статус через API
    const fetchStatus = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/user/subscription-status?userId=${userId}`
        );
        if (response.ok) {
          const premiumStatus = await response.json();
          setStatus(premiumStatus);
        } else {
          console.error("Failed to fetch subscription status");
        }
      } catch (error) {
        console.error("Error fetching premium status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [userId, externalStatus]);

  if (loading) {
    return (
      <div className="mt-2">
        <div className="w-full h-4 bg-zinc-800 rounded animate-pulse" />
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const getStatusIcon = () => {
    if (!status.isPremium) {
      return null;
    }

    switch (status.source) {
      case "subscription":
        return <Crown className="h-3 w-3 text-orange-500" />;
      case "feedback":
        return <Sparkles className="h-3 w-3 text-purple-500" />;
      case "trial":
        return <Clock className="h-3 w-3 text-blue-500" />;
      default:
        return <Crown className="h-3 w-3 text-orange-500" />;
    }
  };

  const getStatusText = () => {
    if (!status.isPremium) {
      return "Free Plan";
    }

    switch (status.source) {
      case "subscription":
        return status.daysRemaining > 0
          ? `Premium • ${status.daysRemaining} days`
          : "Premium";
      case "feedback":
        return status.daysRemaining > 0
          ? `Feedback Premium • ${status.daysRemaining} days`
          : "Feedback Premium";
      case "trial":
        return status.daysRemaining > 0
          ? `Trial • ${status.daysRemaining} days`
          : "Trial";
      default:
        return "Premium";
    }
  };

  const getStatusColor = () => {
    if (!status.isPremium) {
      return "text-zinc-500";
    }

    switch (status.source) {
      case "subscription":
        return "text-orange-500";
      case "feedback":
        return "text-purple-500";
      case "trial":
        return "text-blue-500";
      default:
        return "text-orange-500";
    }
  };

  return (
    <div className="mt-2">
      <div
        className={`flex items-center text-xs font-medium ${getStatusColor()}`}
      >
        {getStatusIcon()}
        <span className="ml-1">{getStatusText()}</span>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
