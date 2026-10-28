"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useHomeMotion } from "@/components/motion/MotionScope";

type Item = {
  _id: string;
  imageUrl: string;
  alt: string;
  caption?: string;
  category: string;
  designation: string;
};

const filters = [
  { id: "all", label: "All" },
  { id: "wedding", label: "Weddings" },
  { id: "corporate", label: "Corporate" },
  { id: "festival", label: "Festivals" },
  { id: "general", label: "Styling" },
];

export function GalleryGrid({
  items,
  theme = "light",
}: {
  items: Item[];
  theme?: "light" | "dark";
}) {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const homeMotion = useHomeMotion();
  const animateItems = homeMotion && !reduce;

  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight")
        setLightbox((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) =>
          i === null ? null : (i - 1 + filtered.length) % filtered.length
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, filtered.length, close]);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              filter === f.id
                ? theme === "dark"
                  ? "bg-porcelain text-ink"
                  : "bg-ink text-porcelain"
                : theme === "dark"
                  ? "border border-porcelain/25 text-porcelain/85 hover:bg-porcelain/10"
                  : "bg-sand/60 text-taupe hover:bg-sand"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => {
          const tileClass =
            "group relative aspect-[4/3] w-full overflow-hidden rounded-2xl film-frame focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne";
          const content = (
            <>
              <Image
                src={item.imageUrl}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {item.designation === "inspiration" && (
                <span className="sr-only">Event inspiration imagery</span>
              )}
            </>
          );

          if (!animateItems) {
            return (
              <button
                key={item._id}
                type="button"
                className={tileClass}
                onClick={() => setLightbox(index)}
              >
                {content}
              </button>
            );
          }

          return (
            <motion.button
              key={item._id}
              type="button"
              className={tileClass}
              onClick={() => setLightbox(index)}
              initial={{ opacity: 0, y: 28, scale: 0.94, rotate: index % 2 ? 3 : -3 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 22,
                delay: Math.min(index * 0.07, 0.28),
              }}
            >
              {content}
            </motion.button>
          );
        })}
      </div>

      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-porcelain/10 p-2 text-porcelain"
            onClick={close}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-porcelain/10 p-2 text-porcelain"
            onClick={() =>
              setLightbox((lightbox - 1 + filtered.length) % filtered.length)
            }
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="max-h-[85vh] max-w-4xl">
            <Image
              src={filtered[lightbox].imageUrl}
              alt={filtered[lightbox].alt}
              width={1200}
              height={900}
              className="max-h-[75vh] w-auto rounded-lg object-contain"
              priority
            />
            {filtered[lightbox].caption && (
              <p className="mt-3 text-center text-sm text-porcelain/80">
                {filtered[lightbox].caption}
                {filtered[lightbox].designation === "inspiration" && " — inspiration"}
              </p>
            )}
          </div>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-porcelain/10 p-2 text-porcelain md:right-16"
            onClick={() => setLightbox((lightbox + 1) % filtered.length)}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
