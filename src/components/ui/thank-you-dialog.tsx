"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, Medal, Sparkles } from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";
import GradientText from "@/components/ui/gradient-text";

interface ThankYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThankYouDialog({ open, onOpenChange }: ThankYouDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="bg-transparent border-none p-0 max-w-md">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="relative"
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-20 pointer-events-none animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl opacity-20 pointer-events-none animate-pulse"></div>

              <div className="relative z-10 p-8">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-full">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center flex flex-col items-center mb-6"
                >
                  <GradientText
                    className="text-2xl font-bold mb-2 text-center"
                    colors={["#f97316", "#ea580c", "#f97316"]}
                  >
                    Thank You!
                  </GradientText>
                  <p className="text-zinc-300 text-lg">
                    We appreciate your valuable feedback
                  </p>
                </motion.div>

                {/* Premium Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-2 rounded-lg">
                        <Medal className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          Premium Reward
                        </p>
                        <p className="text-secondary text-sm">
                          As a token of our gratitude
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-zinc-300">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>5 days of free premium access</span>
                      </div>
                      <div className="flex items-center space-x-3 text-zinc-300">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>Unlimited quiz generation</span>
                      </div>
                      <div className="flex items-center space-x-3 text-zinc-300">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>Advanced analytics</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-orange-500 hover:to-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                    onClick={() => onOpenChange(false)}
                  >
                    Continue to Quizzley
                  </Button>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 text-center"
                >
                  <p className="text-secondary text-sm">
                    Your feedback helps us make Quizzley even better!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
