"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useHomeMotion } from "@/components/motion/MotionScope";
import {
  type RevealVariant,
  homeRevealVariants,
  springPop,
  springSoft,
} from "@/components/motion/variants";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  /** Animate as soon as the section mounts (above-the-fold). */
  immediate?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
  immediate = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  const homeMotion = useHomeMotion();

  if (reduce || !homeMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = homeRevealVariants;
  const transition = {
    ...springPop,
    delay,
  };

  if (immediate) {
    return (
      <motion.div
        className={className}
        variants={variants[variant]}
        initial="hidden"
        animate="visible"
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -6% 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
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
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = "pop",
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
      transition={springSoft}
    >
      {children}
    </motion.div>
  );
}
