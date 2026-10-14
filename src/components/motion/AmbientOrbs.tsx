"use client";

import { motion, useReducedMotion } from "motion/react";

export function AmbientOrbs() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute -left-24 top-[12%] h-72 w-72 rounded-full bg-champagne/25 blur-3xl"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, 30, 50, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 top-[45%] h-96 w-96 rounded-full bg-sand/50 blur-3xl"
        animate={{
          x: [0, -50, 20, 0],
          y: [0, -40, 30, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[8%] left-[30%] h-64 w-64 rounded-full bg-hero-gold/20 blur-3xl"
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -20, 40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}
