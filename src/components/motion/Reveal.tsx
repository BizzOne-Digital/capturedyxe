"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useHomeMotion } from "@/components/motion/MotionScope";
import {
  type RevealVariant,
  homeRevealTransition,
  homeRevealVariants,
} from "@/components/motion/variants";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
}: RevealProps) {
  const reduce = useReducedMotion();
  const homeMotion = useHomeMotion();

  if (reduce || !homeMotion) {
    return <div className={className}>{children}</div>;
  }

  const transition = { ...homeRevealTransition, delay };

  return (
    <motion.div
      className={className}
      variants={homeRevealVariants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -5% 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.09,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const homeMotion = useHomeMotion();
  if (reduce || !homeMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.06 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = "rise",
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
}) {
  const reduce = useReducedMotion();
  const homeMotion = useHomeMotion();
  if (reduce || !homeMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={homeRevealVariants[variant]}
      transition={homeRevealTransition}
    >
      {children}
    </motion.div>
  );
}
