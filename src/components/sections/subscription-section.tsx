import React from "react";
import { AnimatedCard } from "../ui/animated-card";
import SpotlightCard from "../ui/spotlight-card";
import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import GradientText from "../ui/gradient-text";
import SubscribeBtn from "@/app/(user)/billing/SubscribeBtn";
import { auth } from "@/auth";
import { LoginModal } from "../auth/login-modal";

type Props = {};

const pricing = [
  {
    name: "Free",
    price: "$0",
    description: "Limited free quizzes per day",
    features: [
      "3 quizzes per day",
      "Standard Quizz Settings",
      "Dashboard with Quizz History",
    ],
    trial: true,
  },
  {
    name: "Premium",
    price: "$5",
    description: "Full platform access after trial period",
    features: [
      "3 days of free trial",
      "Unlimited usage",
      "Advanced Quizz Settings",
      "Dashboard with Quizz History",
    ],
    trial: false,
    stripePriceId: "price_1OqX8X2eZvKYlo2C9Q9Q9Q9Q",
  },
];

const SubscriptionSection = async (props: Props) => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <section className="bg-gradient-to-b from-zinc-950 to-background py-20 sm:py-24 relative">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
            Simple, Transparent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              Pricing
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Choose the plan that works best for you
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {pricing.slice(0, 2).map((plan, index) => (
            <AnimatedCard
              key={plan.name}
              delay={index * 0.2}
            >
              <SpotlightCard
                className="h-full transition-all duration-300 hover:scale-105"
                spotlightColor="rgba(255, 106, 0, 0.15)"
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex flex-row justify-between sm:items-center sm:justify-between mb-8 gap-4">
                    <h3 className="text-3xl font-extrabold leading-8 text-white">
                      {plan.name === "Premium" ? (
                        <GradientText
                          colors={[
                            "#FF6B00",
                            "#FFA500",
                            "#FF6B00",
                            "#FFA500",
                            "#FF6B00",
                          ]}
                          animationSpeed={3}
                          showBorder={false}
                          className="custom-class"
                        >
                          {plan.name}
                        </GradientText>
                      ) : (
                        plan.name
                      )}
                    </h3>
                    <div className="flex items-baseline gap-x-1">
                      <span className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                        {plan.price}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-gray-400">
                        /month
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-lg leading-6 text-gray-300 mb-8">
                    {plan.description}
                  </p>

                  {/* Features List */}
                  <div className="flex-grow">
                    <ul
                      role="list"
                      className="space-y-4 text-md leading-6 text-gray-300"
                    >
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-x-3"
                        >
                          <CheckCircle className="h-5 w-5 flex-none text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="w-full flex justify-center mt-8">
                    {plan.trial ? (
                      <LoginModal>
                        <Button
                          className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-orange-600/90 shadow-xl shadow-primary/25 hover:shadow-primary/40 text-lg font-bold border-0 relative overflow-hidden group"
                          variant="default"
                        >
                          <span className="relative z-10">Start Free</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </Button>
                      </LoginModal>
                    ) : (
                      <div className="w-full">
                        <SubscribeBtn userId={userId} />
                      </div>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
