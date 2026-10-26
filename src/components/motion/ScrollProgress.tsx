"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/** Thin champagne bar at the top that fills as the visitor scrolls the home page. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  if (reduce) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-champagne"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
