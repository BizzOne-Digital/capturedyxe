"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { MotionScopeProvider } from "@/components/motion/MotionScope";

/** Home-only: light scroll fades. Other pages have no motion scope. */
export function HomeMotionShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <MotionScopeProvider enabled>
        <div className="relative w-full min-w-0">{children}</div>
      </MotionScopeProvider>
    </MotionConfig>
  );
}
