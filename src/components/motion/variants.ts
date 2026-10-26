import type { Transition, Variants } from "motion/react";

export const springPop: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 22,
  mass: 0.85,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 24,
  mass: 1,
};

export const revealVariants: Record<string, Variants> = {
  rise: {
    hidden: { opacity: 0, y: 36, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.65, rotate: -10, filter: "blur(8px)" },
    visible: { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" },
  },
  tilt: {
    hidden: { opacity: 0, y: 40, rotate: 8, skewX: 4 },
    visible: { opacity: 1, y: 0, rotate: 0, skewX: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -80, rotate: -3 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 80, rotate: 3 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  zoom: {
    hidden: { opacity: 0, scale: 1.25 },
    visible: { opacity: 1, scale: 1 },
  },
};

export type RevealVariant = keyof typeof revealVariants;

const subtleFade: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

/** Light home-only scroll fades (all variants map to the same motion). */
export const homeRevealVariants: Record<string, Variants> = {
  rise: subtleFade,
  pop: subtleFade,
  tilt: subtleFade,
  left: subtleFade,
  right: subtleFade,
  zoom: subtleFade,
};

export const homeRevealTransition: Transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

export const variantCycle: RevealVariant[] = ["rise", "pop", "tilt", "left", "right", "zoom"];
