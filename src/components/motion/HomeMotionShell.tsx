"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { MotionScopeProvider } from "@/components/motion/MotionScope";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";

/** Home-only motion. Other pages render static content (no MotionScope). */
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
