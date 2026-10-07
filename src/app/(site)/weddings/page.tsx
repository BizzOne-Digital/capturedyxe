import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { siteImages } from "@/lib/site-images";

export const metadata = { title: "Weddings" };

export default function WeddingsPage() {
  return (
    <>
      <section className="relative flex min-h-[70vh] w-full max-w-full items-end overflow-hidden">
        <Image
          src={siteImages.weddingBanquet}
          alt="Photo booth at an elegant wedding reception"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 md:px-8 text-porcelain">
          <Reveal>
            <h1 className="max-w-full font-display text-[clamp(2.25rem,8vw,4.5rem)]">Weddings</h1>
            <p className="mt-4 max-w-xl text-porcelain/85">
              Timeless strips, personalized templates, and a guest experience that feels as considered as your
              venue styling.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="font-display text-4xl">Designed for your day</h2>
            <ul className="mt-6 space-y-4 text-taupe">
              <li>Venue-friendly modern-retro setups with warm lighting</li>
              <li>Personalized photo strip templates matching your palette and monogram</li>
              <li>Guest-friendly flow so lines move quickly between dances and toasts</li>
              <li>Physical keepsakes and digital copies guests can share</li>
            </ul>
          </Reveal>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden film-frame">
            <Image
              src={siteImages.weddingBalloons}
              alt="Wedding celebration with balloon arch and photo booth"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-sand/40 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-4xl">Begin your wedding enquiry</h2>
          <ButtonLink
            href="/booking?eventType=Wedding"
            className="mt-8"
          >
            Check Availability
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
