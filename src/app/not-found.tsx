"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GradientText from "@/components/ui/gradient-text";
import { MdOutlineSpaceDashboard } from "react-icons/md";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className="relative max-w-md w-full"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-20 pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl opacity-20 pointer-events-none animate-pulse"></div>

          <div className="relative z-10 p-8">
            {/* 404 Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-red-400 to-red-600 p-4 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              </div>
            </motion.div>

            {/* 404 Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-4"
            >
              <GradientText
                className="text-6xl font-bold mb-2"
                colors={["#ef4444", "#dc2626", "#ef4444"]}
              >
                404
              </GradientText>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center flex flex-col items-center mb-6"
            >
              <GradientText
                className="text-2xl font-bold mb-2 text-center"
                colors={["#f97316", "#ea580c", "#f97316"]}
              >
                Page not found
              </GradientText>
              <p className="text-zinc-300 text-lg">
                It seems that the page you are looking for does not exist or has
                been moved
              </p>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-2 rounded-lg">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">What can you do?</p>
                    <p className="text-secondary text-sm">Try these options</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-zinc-300">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Check the URL</span>
                  </div>
                  <div className="flex items-center space-x-3 text-zinc-300">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Return to the main page</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <Link href="/">
                <Button className="w-full rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-orange-600/90 shadow-xl shadow-primary/25 hover:shadow-primary/40 text-lg font-bold border-0 relative overflow-hidden group">
                  Homepage
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full py-4 rounded-2xl bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 transition-all duration-300 text-base font-medium"
                onClick={handleGoBack}
              >
                Dashboard
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <p className="text-secondary text-sm">
                Don&apos;t worry, let&apos;s continue creating amazing quizzes!
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
