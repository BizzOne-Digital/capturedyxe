"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { ExperienceGalleryShot } from "@/lib/experience-gallery";

export function ExperiencePhotoWall({ shots }: { shots: ExperienceGalleryShot[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4 lg:gap-5">
      {shots.map((shot, i) => {
        const tall = i % 3 === 0;
        const rotate = i % 2 === 0 ? -4 : 4;

        if (reduce) {
          return (
            <div
              key={shot.imageUrl}
              className="mb-3 break-inside-avoid overflow-hidden rounded-2xl film-frame md:mb-4"
            >
              <div className={`relative w-full ${tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                <Image src={shot.imageUrl} alt={shot.alt} fill className="object-cover" sizes="25vw" />
              </div>
            </div>
          );
        }

        return (
          <motion.figure
            key={shot.imageUrl}
            className="mb-3 break-inside-avoid overflow-hidden rounded-2xl film-frame md:mb-4"
            initial={{ opacity: 0, y: 48, scale: 0.85, rotate }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            whileHover={{
              scale: 1.04,
              rotate: 0,
              y: -8,
              boxShadow: "0 28px 60px rgba(25,25,25,0.22)",
              zIndex: 30,
            }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 20,
              delay: (i % 4) * 0.06,
            }}
          >
            <div className={`relative w-full ${tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
              <motion.div className="absolute inset-0" whileHover={{ scale: 1.08 }} transition={{ duration: 0.4 }}>
                <Image src={shot.imageUrl} alt={shot.alt} fill className="object-cover" sizes="25vw" />
              </motion.div>
            </div>
            {shot.caption ? (
              <figcaption className="bg-ink/90 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-porcelain/90">
                {shot.caption}
              </figcaption>
            ) : null}
          </motion.figure>
        );
      })}
    </div>
  );
}
