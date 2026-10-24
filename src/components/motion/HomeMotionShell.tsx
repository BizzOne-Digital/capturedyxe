"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { MotionScopeProvider } from "@/components/motion/MotionScope";

/** Home-only motion: orbs + scroll reveals. Other pages stay static. */
export function HomeMotionShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <MotionScopeProvider enabled>
        <AmbientOrbs />
        <div className="relative z-[1] w-full min-w-0">{children}</div>
      </MotionScopeProvider>
    </MotionConfig>
  );
}
