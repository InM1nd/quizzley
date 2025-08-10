"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useReward } from "react-rewards";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, BookOpen, BarChart2, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Props = {
  scorePercentage: number;
  score: number;
  totalQuestions: number;
};

const BentoBox = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800/50 ${className}`}
  >
    {children}
  </motion.div>
);

const QuizzSubmission = (props: Props) => {
  const { scorePercentage, score, totalQuestions } = props;
  const { reward } = useReward("rewardId", "confetti");
  const router = useRouter();

  useEffect(() => {
    if (scorePercentage === 100) {
      reward();
    }
  }, [scorePercentage, reward]);

  const handleExit = () => {
    router.push("/dashboard");
  };

  const getFeedback = () => {
    if (scorePercentage === 100) {
      return "Perfect score! You're a quiz master! 🏆";
    } else if (scorePercentage >= 80) {
      return "Great job! You're really good at this! 🌟";
    } else if (scorePercentage >= 60) {
      return "Good effort! Keep practicing to improve! 💪";
    } else {
      return "Keep studying! You'll get better with practice! 📚";
    }
  };

  const getRecommendations = () => {
    if (scorePercentage < 60) {
      return "Try reviewing the material again and take the quiz later.";
    } else if (scorePercentage < 80) {
      return "Focus on the topics where you made mistakes.";
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col flex-1 min-h-screen"
      >
        <div className="sticky top-0 z-10 w-full">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 max-w-7xl mx-auto">
            <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between p-4 gap-4">
              <Button
                size={"icon"}
                variant={"default"}
                onClick={handleExit}
                className="border-zinc-800 hover:bg-orange-500/10 hover:text-orange-500"
              >
                <X />
              </Button>
            </header>
          </div>
        </div>

        <main className="flex-1 py-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Основной результат */}
            <BentoBox className="md:col-span-2 lg:col-span-2">
              <div className="flex flex-col items-center gap-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Quiz Complete!
                  </h2>
                  <p className="text-secondary mt-2">{getFeedback()}</p>
                </div>

                <div className="relative w-48 h-48">
                  {scorePercentage === 100 ? (
                    <div className="relative">
                      <Image
                        src="/images/owl-smiling.png"
                        alt="Smiling Owl"
                        width={400}
                        height={400}
                        className="object-contain"
                      />
                      <span id="rewardId" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold text-orange-500">
                            {scorePercentage}%
                          </span>
                        </div>
                        <svg
                          className="w-full h-full"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            className="text-zinc-800"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="44"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-orange-500"
                            strokeWidth="8"
                            strokeDasharray={`${scorePercentage * 2.76} 276`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="44"
                            cx="50"
                            cy="50"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </BentoBox>

            {/* Статистика */}
            <BentoBox>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-orange-500">
                  <BarChart2 className="h-5 w-5" />
                  <h3 className="font-semibold">Statistics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-zinc-700/50 rounded-lg">
                    <p className="text-green-500 font-semibold text-2xl">
                      {score}
                    </p>
                    <p className="text-sm text-secondary">Correct</p>
                  </div>
                  <div className="text-center p-4 bg-zinc-700/50 rounded-lg">
                    <p className="text-red-500 font-semibold text-2xl">
                      {totalQuestions - score}
                    </p>
                    <p className="text-sm text-secondary">Incorrect</p>
                  </div>
                </div>
              </div>
            </BentoBox>

            {/* Рекомендации */}
            {getRecommendations() && (
              <BentoBox>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-orange-500">
                    <AlertCircle className="h-5 w-5" />
                    <h3 className="font-semibold">Recommendations</h3>
                  </div>
                  <p className="text-zinc-300">{getRecommendations()}</p>
                </div>
              </BentoBox>
            )}

            {/* Плацдарм для будущих секций */}
            <BentoBox>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-orange-500">
                  <BookOpen className="h-5 w-5" />
                  <h3 className="font-semibold">Study Materials</h3>
                </div>
                <p className="text-secondary">Coming soon...</p>
              </div>
            </BentoBox>

            {/* Плацдарм для будущих секций */}
            <BentoBox>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-orange-500">
                  <Target className="h-5 w-5" />
                  <h3 className="font-semibold">Learning Goals</h3>
                </div>
                <p className="text-secondary">Coming soon...</p>
              </div>
            </BentoBox>

            {/* Навигация */}
            <BentoBox className="md:col-span-2 lg:col-span-3">
              <div className="flex justify-center gap-4">
                <Button
                  variant="default"
                  size={"lg"}
                  onClick={handleExit}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 max-w-md"
                >
                  Back to Dashboard
                </Button>
              </div>
            </BentoBox>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default QuizzSubmission;
