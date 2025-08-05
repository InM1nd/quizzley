"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, Chrome } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";

interface LoginModalProps {
  children: React.ReactNode;
  callbackUrl?: string;
}

export function LoginModal({
  children,
  callbackUrl = "/dashboard",
}: LoginModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background/95 to-background/90 border border-white/10 backdrop-blur-sm">
        <DialogHeader className="text-center space-y-6">
          {/* Логотип */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-orange-400/20 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
              <Image
                src="/logo.png"
                alt="Quizzley Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Заголовок */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <DialogTitle className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
              Welcome to Quizzley
            </DialogTitle>
          </motion.div>

          {/* Описание */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <DialogDescription className="text-base text-muted-foreground text-center">
              Login to your account to start creating exciting quizzes
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-4 py-6"
        >
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-500 text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 rounded-full border border-white/10"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <FaGoogle className="h-5 w-5" />
                Login with Google
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              By clicking &quot;Login with Google&quot;, you agree to our{" "}
              <a
                href="/terms"
                className="text-primary hover:underline"
              >
                Terms of Service
              </a>{" "}
              и{" "}
              <a
                href="/privacy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
