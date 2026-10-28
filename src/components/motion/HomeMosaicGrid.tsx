"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useHomeMotion } from "@/components/motion/MotionScope";

type Shot = { src: string; alt: string };

export function HomeMosaicGrid({ shots }: { shots: Shot[] }) {
  const reduce = useReducedMotion();
  const homeMotion = useHomeMotion();

  return (
    <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-2 gap-3 px-4 md:grid-cols-4 md:gap-4 md:px-8">
      {shots.map((shot, i) => {
        const rotate = i % 2 === 0 ? -4 : 4;
        const y = i % 2 === 0 ? 10 : 0;

        if (reduce || !homeMotion) {
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
            initial={{ opacity: 0, y: 36, scale: 0.92, rotate }}
            whileInView={{ opacity: 1, y, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            whileHover={{ scale: 1.04, rotate: 0, y: y - 4 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 22,
              delay: i * 0.08,
            }}
          >
            <Image src={shot.src} alt={shot.alt} fill className="object-cover" sizes="25vw" />
          </motion.div>
        );
      })}
    </div>
  );
}
