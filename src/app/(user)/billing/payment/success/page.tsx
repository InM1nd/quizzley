"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatedCard } from "@/components/ui/animated-card";
import GradientText from "@/components/ui/gradient-text";

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <AnimatedCard
          delay={0.1}
          className="w-full max-w-md"
        >
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-2xl hover:shadow-primary/5 transition-all duration-500">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-full">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <GradientText
                className="text-2xl font-bold mb-2"
                colors={["#10b981", "#34d399", "#10b981"]}
              >
                Payment Successful!
              </GradientText>
              <p className="text-zinc-300 text-lg">
                Your account has been upgraded to premium!
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-zinc-300">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Unlimited quiz generation</span>
                </div>
                <div className="flex items-center space-x-3 text-zinc-300">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center space-x-3 text-zinc-300">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/dashboard"
                className="group relative w-full bg-gradient-to-r from-primary to-orange-500 hover:from-orange-500 hover:to-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-zinc-400 text-sm">
                Start creating unlimited quizzes and track your progress!
              </p>
            </motion.div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
