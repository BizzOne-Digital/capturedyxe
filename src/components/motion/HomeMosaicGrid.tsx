"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

type Shot = { src: string; alt: string };

export function HomeMosaicGrid({ shots }: { shots: Shot[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-2 gap-3 px-4 md:grid-cols-4 md:gap-4 md:px-8">
      {shots.map((shot, i) => {
        const rotate = i % 2 === 0 ? -5 : 5;
        const y = i % 2 === 0 ? 12 : 0;

        if (reduce) {
          return (
            <div
              key={shot.src}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl film-frame md:aspect-[3/4]"
            >
              <Image src={shot.src} alt={shot.alt} fill className="object-cover" sizes="25vw" />
            </div>
          );
        }

        return (
          <motion.div
            key={shot.src}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl film-frame md:aspect-[3/4]"
            style={{ marginTop: y }}
            initial={{ opacity: 0, scale: 0.75, rotate, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0, y }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{
              scale: 1.08,
              rotate: 0,
              zIndex: 20,
              boxShadow: "0 24px 60px rgba(25,25,25,0.25)",
            }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.08 }}
          >
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.45 }}
            >
              <Image src={shot.src} alt={shot.alt} fill className="object-cover" sizes="25vw" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
