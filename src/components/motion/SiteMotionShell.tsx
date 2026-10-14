"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { PageMotion } from "@/components/motion/PageMotion";

export function SiteMotionShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AmbientOrbs />
      <div className="relative z-[1] w-full min-w-0 flex-1">
        <PageMotion>{children}</PageMotion>
      </div>
    </MotionConfig>
  );
}
