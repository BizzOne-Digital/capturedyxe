"use client";

import type { ReactNode } from "react";

export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
