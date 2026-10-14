"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { formatCadWithTaxNote } from "@/lib/money";
import { siteImages } from "@/lib/site-images";

type HeroHomeProps = {
  headline: string;
  subheadline: string;
  heroImageUrl: string;
  startingPriceCents: number;
  ctaPrimary: string;
  ctaSecondary: string;
  tagline: string;
};

function splitHeadline(headline: string) {
  const match = headline.match(/^(.*?)(\s*)(Memories\.?)$/i);
  if (match) {
    return { lead: match[1].trim(), accent: match[3] };
  }
  return { lead: headline, accent: null };
}

const heroBtnBase =
  "inline-flex w-full items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne sm:w-auto";

export function HeroHome({
  headline,
  subheadline,
  heroImageUrl,
  startingPriceCents,
  ctaPrimary,
  ctaSecondary,
  tagline,
}: HeroHomeProps) {
  const reduce = useReducedMotion();
  const { lead, accent } = splitHeadline(headline);
  const imageSrc = heroImageUrl || "/hero-booth.jpg";
  const imageTagline = tagline
    .toLowerCase()
    .replace(/,\s*/g, ". ")
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <section className="relative flex w-full max-w-full flex-col overflow-hidden bg-ivory md:min-h-[min(88vh,880px)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute inset-[-4%] ${reduce ? "" : "hero-bg-motion"}`}>
          <Image
            src={imageSrc}
            alt="Captured.YXE modern wooden photo booth setup"
            fill
            className="object-cover object-[72%_42%] md:object-[88%_center]"
            sizes="100vw"
            priority
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-ivory from-35% via-ivory/95 via-55% to-ivory/15 md:from-40% md:via-ivory/88 md:to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ivory/80 via-transparent to-ivory/40 md:to-transparent"
          aria-hidden
        />
        {!reduce && (
          <div
            className="hero-float-accent absolute bottom-[30%] right-3 h-20 w-14 overflow-hidden rounded-sm border border-ink/10 shadow-[0_12px_40px_rgba(25,25,25,0.18)] sm:right-5 sm:h-24 sm:w-[4.5rem] md:bottom-[28%] md:right-[6%] lg:bottom-[32%] lg:right-[10%] lg:h-28 lg:w-20"
            aria-hidden
          >
            <Image
              src={siteImages.photoStrips}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}
      </div>

      <div className="relative mx-auto flex w-full min-w-0 max-w-7xl flex-col justify-start px-4 pb-8 pt-5 md:flex-1 md:justify-center md:px-8 md:pb-32 md:pt-16">
        <motion.p
          className="max-w-full text-[10px] font-medium uppercase tracking-[0.2em] text-ink/75 sm:text-[11px] sm:tracking-[0.28em] md:tracking-[0.32em]"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Saskatoon photo booth experiences
        </motion.p>

        <motion.h1
          className="mt-3 max-w-full font-display text-[clamp(1.85rem,7.5vw,4.25rem)] leading-[1.08] text-ink md:mt-6 md:max-w-2xl"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.06 }}
        >
          {lead}
          {accent ? (
            <>
              {" "}
              <span className="italic text-hero-gold">{accent}</span>
            </>
          ) : null}
        </motion.h1>

        <motion.p
          className="mt-5 max-w-md text-base leading-relaxed text-taupe md:mt-6 md:text-lg md:leading-relaxed"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          {subheadline}
        </motion.p>

        <motion.div
          className="mt-8 flex w-full min-w-0 max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
        >
          <Link
            href="/booking"
            className={`${heroBtnBase} bg-ink text-porcelain hover:bg-ink/90`}
          >
            {ctaPrimary}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/services"
            className={`${heroBtnBase} border border-ink bg-transparent text-ink hover:bg-ink/5`}
          >
            {ctaSecondary}
          </Link>
        </motion.div>

        <motion.p
          className="mt-5 text-sm text-taupe/90"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          Starting from {formatCadWithTaxNote(startingPriceCents)}
        </motion.p>

        <p
          className="pointer-events-none absolute bottom-36 right-4 hidden max-w-[12rem] text-right font-display text-sm italic leading-snug text-ink/75 md:bottom-40 md:right-12 md:block lg:text-base"
        >
          {imageTagline}
        </p>
      </div>

      <motion.div
        className="relative w-full border-t border-ink/12 bg-ivory/90 px-3 py-3 text-center text-[9px] font-medium uppercase leading-relaxed tracking-[0.16em] text-taupe backdrop-blur-sm sm:px-4 sm:py-4 sm:text-[10px] sm:tracking-[0.24em] md:tracking-[0.28em]"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>Weddings</span>
          <span className="text-ink/25" aria-hidden>/</span>
          <span>Corporate events</span>
          <span className="text-ink/25" aria-hidden>/</span>
          <span>Celebrations</span>
        </p>
      </motion.div>
    </section>
  );
}
