"use client";

import type { ReactNode } from "react";

/** Page wrapper — no full-page enter animation (avoids post-hydration “double load”). */
export function PageMotion({ children }: { children: ReactNode }) {
  return <div className="w-full min-w-0">{children}</div>;
}
