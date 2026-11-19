"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Fades and lifts its children in once when they scroll into view.
// With reduced motion enabled it renders them as they are.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

// Small stagger so a row of cards does not appear all at once.
export function staggerDelay(index: number, columns = 3) {
  return (index % columns) * 0.08;
}
