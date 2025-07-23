"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LampContainer } from "../ui/lamp";
import Magnet from "../ui/magnet";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-background/80"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full">
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
              Join Our Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start using our platform today and experience the benefits
              firsthand!
            </p>
          </div>

          <Magnet
            padding={120}
            disabled={false}
            magnetStrength={3}
            wrapperClassName="w-full max-w-2xl"
            innerClassName="w-full"
          >
            <Button
              size="lg"
              variant="neo"
              className="w-full text-white font-semibold text-lg py-6 px-8 my-12 rounded-full"
              asChild
            >
              <Link
                href="/api/auth/signin?callbackUrl=/dashboard"
                target="_blank"
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Get Started Now
                </span>
              </Link>
            </Button>
          </Magnet>
        </div>
      </div>
    </section>
  );
}
