"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";

type Testimonial = {
  _id: string;
  reviewerName: string;
  quote: string;
  rating?: number;
  eventCategory: string;
};

const filters = [
  { id: "all", label: "All" },
  { id: "wedding", label: "Weddings" },
  { id: "corporate", label: "Corporate" },
  { id: "general", label: "Other" },
];

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/public/testimonials")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const filtered =
    filter === "all"
      ? items
      : filter === "general"
        ? items.filter((t) => t.eventCategory !== "wedding" && t.eventCategory !== "corporate")
        : items.filter((t) => t.eventCategory === filter);

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
    <section className="w-full overflow-x-clip py-20">
      <div className="mx-auto w-full min-w-0 max-w-4xl px-4 md:px-8">
        <Reveal>
          <h1 className="font-display text-5xl text-center">Testimonials</h1>
          <p className="mt-4 text-center text-taupe">
            Real stories from celebrations we are proud to support.
          </p>
        </Reveal>

        <div className="mt-10 flex justify-center gap-2 flex-wrap">
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
          <div className="mt-16 rounded-3xl border border-dashed border-champagne/50 bg-porcelain p-12 text-center">
            <h2 className="font-display text-2xl">Reviews coming soon</h2>
            <p className="mt-4 text-sm text-taupe max-w-md mx-auto">
              We have not published client testimonials yet. When approved reviews are added, they will appear
              here with optional event-type filtering.
            </p>
          </div>
        )}

        <div className="mt-12 space-y-8">
          {filtered.map((t) => (
            <blockquote
              key={t._id}
              className="rounded-2xl border border-ink/10 bg-porcelain p-8"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-champagne">
                {categoryLabel(t.eventCategory)}
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
