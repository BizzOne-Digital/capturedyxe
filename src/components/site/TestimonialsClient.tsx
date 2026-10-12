"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import type { PublicTestimonial } from "@/lib/data/public";

function categoryOf(t: PublicTestimonial): string {
  return t.eventCategory ?? "general";
}

const filters = [
  { id: "all", label: "All" },
  { id: "wedding", label: "Weddings" },
  { id: "corporate", label: "Corporate" },
  { id: "general", label: "Other" },
];

export function TestimonialsClient({ initialItems }: { initialItems: PublicTestimonial[] }) {
  const [items, setItems] = useState<PublicTestimonial[]>(initialItems);
  const [filter, setFilter] = useState("all");
  const [loaded, setLoaded] = useState(initialItems.length > 0);

  useEffect(() => {
    if (initialItems.length > 0) return;
    fetch("/api/public/testimonials")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [initialItems.length]);

  const filtered =
    filter === "all"
      ? items
      : filter === "general"
        ? items.filter(
            (t) => categoryOf(t) !== "wedding" && categoryOf(t) !== "corporate"
          )
        : items.filter((t) => categoryOf(t) === filter);

  const categoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      wedding: "Wedding",
      corporate: "Corporate",
      milestone: "Milestone",
      school: "School event",
      festival: "Festival",
      "product-launch": "Product launch",
      general: "Celebration",
    };
    return labels[category] ?? "Celebration";
  };

  return (
    <section className="w-full overflow-x-clip section-y">
      <div className="mx-auto w-full min-w-0 max-w-4xl px-4 md:px-8">
        <Reveal>
          <h2 className="font-display text-3xl text-center md:text-4xl">Featured testimonials</h2>
          <p className="mt-3 text-center text-sm text-taupe">
            Hand-picked stories from weddings, corporate events, and celebrations across YXE.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-sm ${
                filter === f.id ? "bg-ink text-porcelain" : "bg-sand/60 text-taupe"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loaded && filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-taupe">
            No testimonials in this category yet.
          </p>
        )}

        <div className="mt-12 space-y-8">
          {filtered.map((t) => (
            <blockquote
              key={t._id}
              className="rounded-2xl border border-ink/10 bg-porcelain p-8"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-champagne">
                {categoryLabel(categoryOf(t))}
              </p>
              <p className="mt-3 font-display text-2xl leading-snug text-ink">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-5 text-sm text-taupe">— {t.reviewerName}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
