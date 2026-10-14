"use client";

import { useReducedMotion } from "motion/react";

export function ScrollMarquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  const doubled = [...items, ...items];

  if (reduce) {
    return (
      <ul className="mt-10 flex flex-wrap gap-3">
        {items.map((a) => (
          <li
            key={a}
            className="rounded-full border border-porcelain/20 px-5 py-2 text-sm text-porcelain/90"
          >
            {a}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="marquee-mask relative mt-10 w-full overflow-hidden">
      <div className="marquee-track flex w-max gap-4">
        {doubled.map((a, i) => (
          <span
            key={`${a}-${i}`}
            className="marquee-chip shrink-0 rounded-full border border-porcelain/25 bg-porcelain/5 px-6 py-2.5 text-sm text-porcelain/95 backdrop-blur-sm"
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}
