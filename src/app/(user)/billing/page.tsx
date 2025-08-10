import ManageSubscription from "./ManageSubscription";
import { feedbacks, users } from "@/db/schema";
import { auth, signIn } from "@/auth";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { Settings, Sparkles, ScrollText, Clock } from "lucide-react";
import { getPremiumStatus } from "@/app/actions/userSubscription";
import SubscribeBtn from "./SubscribeBtn";

// Удаляем дублирующиеся интерфейс и функцию checkPremiumStatus
// Они уже определены в @/lib/premium-manager

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!session || !session.user || !session.user.id) {
    signIn();
    return null;
  }

  // Используем существующую функцию из actions
  const premiumStatus = await getPremiumStatus(session.user.id);

  const plan = premiumStatus.isPremium ? "premium" : "free";
  const nextBillingDate = premiumStatus.expiresAt
    ? new Date(premiumStatus.expiresAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Заголовок и текущий план */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/60 p-8 backdrop-blur-sm border border-zinc-800/50">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Subscription Details
            </h1>

            <div className="mt-6 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    plan === "premium"
                      ? "bg-green-400 animate-pulse"
                      : "bg-zinc-400"
                  }`}
                ></div>
                <p className="text-lg">
                  Current Plan:
                  <span
                    className={`ml-2 font-bold ${
                      plan === "premium" ? "text-green-400" : "text-secondary"
                    } uppercase`}
                  >
                    {plan}
                  </span>
                </p>
              </div>
            </div>

            {/* Информация о времени */}
            {premiumStatus.isPremium && (
              <div className="mt-4 flex items-center space-x-4 text-sm text-zinc-300">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {premiumStatus.daysRemaining > 0 && (
                      <span>{premiumStatus.daysRemaining} days </span>
                    )}
                    {premiumStatus.hoursRemaining > 0 && (
                      <span>{premiumStatus.hoursRemaining} hours </span>
                    )}
                    {premiumStatus.minutesRemaining > 0 && (
                      <span>{premiumStatus.minutesRemaining} minutes</span>
                    )}
                    {premiumStatus.daysRemaining === 0 &&
                      premiumStatus.hoursRemaining === 0 &&
                      premiumStatus.minutesRemaining === 0 && (
                        <span>Less than a minute</span>
                      )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Информация о подписке */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Текущие возможности */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/60 p-6 backdrop-blur-sm border border-zinc-800/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Sparkles className="mr-2 text-orange-500" />
              Current Features
            </h2>
            <ul className="space-y-3">
              {plan === "premium" ? (
                <>
                  <li className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    Unlimited Quiz Generation
                  </li>
                  <li className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    Document Upload
                  </li>
                  <li className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    Advanced Analytics
                  </li>
                  <li className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    Priority Support
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center text-secondary">
                    <span className="mr-2">•</span>
                    Basic Quiz Generation
                  </li>
                  <li className="flex items-center text-red-400">
                    <span className="mr-2">✗</span>
                    Document Upload (Premium Only)
                  </li>
                  <li className="flex items-center text-secondary">
                    <span className="mr-2">•</span>
                    Limited Analytics
                  </li>
                  <li className="flex items-center text-secondary">
                    <span className="mr-2">•</span>
                    Standard Support
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Управление подпиской */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/60 p-6 backdrop-blur-sm border border-zinc-800/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="mr-2 text-orange-500" />
              Manage Subscription
            </h2>
            <div className="relative z-10 flex flex-col gap-4">
              <ManageSubscription />
              <SubscribeBtn userId={userId} />
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        {/* <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/60 p-6 backdrop-blur-sm border border-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ScrollText className="text-orange-500" />
              <p className="text-sm text-secondary">
                {premiumStatus.isPremium
                  ? `Premium expires: ${nextBillingDate}`
                  : "No active premium subscription"}
              </p>
            </div>
            <a
              href="#"
              className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
            >
              View Billing History
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default page;