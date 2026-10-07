"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { formatCadWithTaxNote } from "@/lib/money";

type HeroHomeProps = {
  headline: string;
  subheadline: string;
  heroImageUrl: string;
  startingPriceCents: number;
  ctaPrimary: string;
  ctaSecondary: string;
};

export function HeroHome({
  headline,
  subheadline,
  heroImageUrl,
  startingPriceCents,
  ctaPrimary,
  ctaSecondary,
}: HeroHomeProps) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-8 lg:grid-cols-12 lg:items-center lg:py-24">
        <div className="lg:col-span-5">
          <motion.p
            className="text-xs uppercase tracking-[0.25em] text-champagne"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Based in Saskatoon. Made for unforgettable celebrations.
          </motion.p>
          <motion.h1
            className="mt-4 font-display text-5xl leading-[1.05] text-ink md:text-6xl lg:text-7xl"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            {headline}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-lg text-lg text-taupe"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {subheadline}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
          >
            <ButtonLink href="/booking">{ctaPrimary}</ButtonLink>
            <ButtonLink href="/services" variant="secondary">
              {ctaSecondary}
            </ButtonLink>
          </motion.div>
          <p className="mt-6 text-sm text-taupe">
            Starting from {formatCadWithTaxNote(startingPriceCents)}
          </p>
        </div>

        <div className="relative lg:col-span-7">
          <motion.div
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] film-frame md:aspect-[5/4]"
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={heroImageUrl}
              alt="Photo booth celebration atmosphere — inspiration"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
            <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-porcelain/30" />
          </motion.div>

          {!reduce && (
            <>
              <motion.div
                className="photo-strip absolute -left-4 top-12 hidden w-16 rounded-lg border border-ink/10 bg-porcelain p-2 shadow-lg md:block lg:-left-8"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                <div className="aspect-[2/3] rounded bg-sand/80" />
              </motion.div>
              <motion.div
                className="photo-strip absolute -right-2 bottom-8 hidden w-14 rounded-lg border border-ink/10 bg-porcelain p-2 shadow-lg md:block"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                <div className="aspect-[2/3] rounded bg-champagne/30" />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
