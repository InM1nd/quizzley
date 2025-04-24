"use client";

import { AnimatedCard } from "../ui/animated-card";
import { AnimatedIcon } from "../ui/animated-icon";
import { Brain, CheckCircle, Sparkles } from "lucide-react";

const features = [
  {
    title: "AI-Powered Quizzes",
    description: "Create quizzes using artificial intelligence in seconds",
    icon: Brain,
  },
  {
    title: "Smart Analytics",
    description: "Get detailed statistics and result analysis",
    icon: Sparkles,
  },
  {
    title: "Easy to Use",
    description: "Intuitive interface for creating and managing quizzes",
    icon: CheckCircle,
  },
];

export function FeaturesSection() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Everything You Need to Create Quizzes
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Our tools help you create high-quality quizzes quickly and efficiently
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3 place-items-center">
          {features.map((feature, index) => (
            <AnimatedCard
              key={feature.title}
              delay={index * 0.2}
              className="flex flex-col text-center items-center max-w-sm mx-auto"
            >
              <dt className="flex flex-col items-center gap-y-3 text-base font-semibold leading-7 text-white">
                <div className="bg-primary/10 p-3 rounded-full">
                  <AnimatedIcon
                    icon={feature.icon}
                    className="h-6 w-6 text-primary"
                  />
                </div>
                {feature.title}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto text-center">{feature.description}</p>
              </dd>
            </AnimatedCard>
          ))}
        </dl>
      </div>
    </div>
  );
}
