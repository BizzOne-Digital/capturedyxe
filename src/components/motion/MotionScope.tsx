"use client";

import { createContext, useContext, type ReactNode } from "react";

const MotionScopeContext = createContext(false);

export function MotionScopeProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  return (
    <MotionScopeContext.Provider value={enabled}>{children}</MotionScopeContext.Provider>
  );
}

/** True only inside `<HomeMotionShell>` on the home page. */
export function useHomeMotion() {
  return useContext(MotionScopeContext);
}
