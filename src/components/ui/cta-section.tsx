"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LampContainer } from "./lamp";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-background ">
      <div className="absolute inset-0 -z-10"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <LampContainer>
          <motion.h2
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-b from-orange-400 to-white py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.4,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white text-center"
          >
            Join thousands of users who already use Quizz AI to create effective
            tests
          </motion.p>
          <motion.div
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
              >
                Try for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </LampContainer>
      </div>
    </section>
  );
}
