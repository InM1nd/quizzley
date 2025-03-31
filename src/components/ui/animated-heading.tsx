"use client";

import { motion } from "framer-motion";

interface AnimatedHeadingProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedHeading({
  children,
  className = "",
  delay = 0,
}: AnimatedHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
