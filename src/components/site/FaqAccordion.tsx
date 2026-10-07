"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type FaqItem = {
  _id: string;
  question: string;
  answer: string;
  category: string;
};

const categoryLabels: Record<string, string> = {
  booking: "Booking",
  "booth-experience": "Booth Experience",
  "prints-keepsakes": "Prints & Keepsakes",
  "event-planning": "Event Planning",
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const grouped = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([cat, catItems]) => (
        <section key={cat} aria-labelledby={`faq-${cat}`}>
          <h3
            id={`faq-${cat}`}
            className="font-display text-2xl text-ink md:text-3xl"
          >
            {categoryLabels[cat] ?? cat}
          </h3>
          <ul className="mt-4 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-porcelain">
            {catItems.map((faq) => {
              const open = openId === faq._id;
              return (
                <li key={faq._id}>
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : faq._id)}
                  >
                    <span className="font-medium text-ink">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-champagne transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {open && (
                    reduce ? (
                      <div className="px-5 pb-4 text-sm leading-relaxed text-taupe">
                        {faq.answer}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-sm leading-relaxed text-taupe">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
