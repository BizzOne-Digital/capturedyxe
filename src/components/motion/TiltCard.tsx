"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 900 }}
      initial={{ opacity: 0, y: 36, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{
        y: -14,
        scale: 1.03,
        rotateX: -4,
        rotateY: 6,
        boxShadow: "0 28px 70px rgba(25,25,25,0.18)",
      }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
