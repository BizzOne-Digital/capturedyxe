"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useHomeMotion } from "@/components/motion/MotionScope";
import {
  type RevealVariant,
  homeMobileRevealTransition,
  homeMobileRevealVariants,
} from "@/components/motion/variants";
import { useIsMobile } from "@/hooks/use-is-mobile";

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
  const isMobile = useIsMobile();

  if (reduce || !homeMotion || !isMobile) {
    return <div className={className}>{children}</div>;
  }

  const transition = { ...homeMobileRevealTransition, delay };

  return (
    <motion.div
      className={className}
      variants={homeMobileRevealVariants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -4% 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const homeMotion = useHomeMotion();
  const isMobile = useIsMobile();
  if (reduce || !homeMotion || !isMobile) return <div className={className}>{children}</div>;

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
  variant = "rise",
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
}) {
  const reduce = useReducedMotion();
  const homeMotion = useHomeMotion();
  const isMobile = useIsMobile();
  if (reduce || !homeMotion || !isMobile) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={homeMobileRevealVariants[variant]}
      transition={homeMobileRevealTransition}
    >
      {children}
    </motion.div>
  );
}
