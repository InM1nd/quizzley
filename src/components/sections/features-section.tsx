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
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {features.map((feature, index) => (
            <AnimatedCard
              key={feature.title}
              delay={index * 0.2}
              className="flex flex-col"
            >
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <AnimatedIcon icon={feature.icon} />
                {feature.title}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto">{feature.description}</p>
              </dd>
            </AnimatedCard>
          ))}
        </dl>
      </div>
    </div>
  );
}
