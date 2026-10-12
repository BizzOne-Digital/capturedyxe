import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, HeartHandshake, Palette, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { siteImages } from "@/lib/site-images";

export const metadata = {
  title: "About Us",
  description:
    "Meet Captured.YXE — Saskatoon photo booth rentals blending vintage soul with instant prints, studio lighting, and keepsakes your guests will actually take home.",
};

const highlights = [
  { label: "Based in", value: "Saskatoon, SK" },
  { label: "Capture", value: "DSLR + pro lighting" },
  { label: "Keepsakes", value: "Prints & digital" },
  { label: "Style", value: "Modern-retro booth" },
];

const values = [
  {
    icon: Camera,
    title: "Professional capture",
    body:
      "Studio-grade lighting and DSLR cameras keep every frame flattering — from ballroom formals to warehouse dance floors.",
  },
  {
    icon: Sparkles,
    title: "Energy on the floor",
    body:
      "We design for participation: quick lines, friendly hosts, and a setup guests gravitate toward all night long.",
  },
  {
    icon: Palette,
    title: "Your look, your story",
    body:
      "Custom strip templates, backdrops, and props so the booth feels like part of your wedding, brand, or milestone.",
  },
  {
    icon: HeartHandshake,
    title: "Tangible memories",
    body:
      "Physical prints and digital sharing mean the night does not end when the music stops — guests leave with something real.",
  },
];

const steps = [
  {
    step: "01",
    title: "We learn your celebration",
    body: "Venue, guest count, timeline, and the vibe you are going for — so setup and flow match your event.",
  },
  {
    step: "02",
    title: "We style the booth",
    body: "Wooden-tripod presence, lighting checks, templates, and props aligned with your palette or brand.",
  },
  {
    step: "03",
    title: "Guests step in",
    body: "Simple prompts on screen, instant previews, and prints that roll out while the party keeps moving.",
  },
  {
    step: "04",
    title: "Everyone leaves with more",
    body: "Strips in hand, digital copies to share, and optional upgrades like magnetic keepsakes — by package.",
  },
];

const audiences = [
  { label: "Weddings", href: "/weddings" },
  { label: "Corporate events", href: "/corporate-events" },
  { label: "Milestones", href: "/services" },
  { label: "School & grad", href: "/services" },
  { label: "Festivals", href: "/services" },
  { label: "Holiday parties", href: "/services" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[48vh] w-full max-w-full items-end overflow-hidden md:min-h-[72vh]">
        <Image
          src={siteImages.boothPrimary}
          alt="Captured.YXE modern wooden photo booth in an elegant venue"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 pt-20 md:px-8 md:pb-20 md:pt-32">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">
              About Captured.YXE
            </p>
            <h1 className="mt-4 max-w-full font-display text-[clamp(2rem,7.5vw,4.5rem)] leading-[1.05] text-porcelain">
              Vintage soul.
              <br className="hidden sm:block" />
              Instant roll.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-porcelain/85 md:text-lg">
              We are Saskatoon&apos;s modern-retro photo booth team — here to turn laughter, toasts, and
              spontaneous poses into keepsakes you can hold, gift, and pin on the fridge.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="border-b border-ink/8 bg-porcelain section-y-lg">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">Our story</p>
              <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
                Making moments tangible
              </h2>
              <p className="mt-6 text-taupe leading-relaxed">
                Phone galleries are easy to forget. A photo strip from your best friend&apos;s wedding, your
                company launch, or your graduation night — that stays with you.
              </p>
              <p className="mt-4 text-taupe leading-relaxed">
                Captured.YXE exists for hosts who want more than a corner with a ring light. We bring crafted
                wooden tripods, clean editorial styling, and an experience that feels intentional inside your
                venue — not bolted on.
              </p>
              <blockquote className="mt-8 border-l-2 border-champagne pl-5 font-display text-xl text-ink md:text-2xl">
                &ldquo;Every celebration deserves something guests can take home — not just scroll past.&rdquo;
              </blockquote>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl film-frame sm:row-span-2">
                  <Image
                    src={siteImages.boothDetail}
                    alt="Close-up of wooden photo booth camera and screen"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl film-frame">
                  <Image
                    src={siteImages.photoStrips}
                    alt="Guests holding printed photo strips"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl film-frame">
                  <Image
                    src={siteImages.propsFlatlay}
                    alt="Curated photo booth props"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          <ul className="mt-16 grid gap-4 border-t border-ink/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.05}>
                <li>
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-champagne">
                    {item.label}
                  </p>
                  <p className="mt-2 font-display text-2xl text-ink">{item.value}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Values */}
      <section className="section-y-lg">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">What we stand for</p>
            <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">Built for hosts who care about the details</h2>
            <p className="mt-4 text-taupe leading-relaxed">
              From first enquiry to last print, we treat your event like the milestone it is — polished setup,
              thoughtful customization, and a team that shows up ready.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {values.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <article className="group h-full rounded-2xl border border-ink/10 bg-ivory/60 p-8 transition-shadow hover:shadow-[0_12px_40px_rgba(25,25,25,0.08)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/40 bg-porcelain text-champagne">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-taupe">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="bg-ink section-y-lg text-porcelain">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">The experience</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">How a Captured.YXE night unfolds</h2>
              <p className="mt-5 text-porcelain/75 leading-relaxed">
                You should not have to micromanage the booth. We arrive prepared, integrate with your timeline,
                and keep guests smiling without stealing focus from your program.
              </p>
              <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-3xl film-frame">
                <Image
                  src={siteImages.weddingBanquet}
                  alt="Photo booth at a wedding reception"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>

            <ol className="space-y-6">
              {steps.map((item, i) => (
                <Reveal key={item.step} delay={i * 0.07}>
                  <li className="flex gap-5 rounded-2xl border border-porcelain/10 bg-porcelain/5 p-6 md:p-7">
                    <span className="font-display text-3xl text-champagne">{item.step}</span>
                    <div>
                      <h3 className="font-display text-xl text-porcelain md:text-2xl">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-porcelain/75">{item.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Craft */}
      <section className="section-y-lg">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 md:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">The setup</p>
            <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
              Signature wooden-tripod presence
            </h2>
            <p className="mt-6 text-taupe leading-relaxed">
              Warm materials, minimal clutter, and lighting that flatters — our booths photograph beautifully
              in your venue photos and feel inviting in person.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-taupe">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" aria-hidden />
                Professional DSLR capture with tuned studio lighting
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" aria-hidden />
                Styled backdrops and curated prop collections
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" aria-hidden />
                On-site support so lines move and energy stays high
              </li>
            </ul>
            <ButtonLink href="/gallery" variant="secondary" className="mt-10">
              View the gallery
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] film-frame">
              <Image
                src={siteImages.archBackdrop}
                alt="Styled arched backdrop at an event"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Keepsakes */}
      <section className="border-y border-ink/8 bg-sand/35 section-y-lg">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="grid grid-cols-2 gap-4">
              <Reveal>
                <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-3xl film-frame">
                  <Image
                    src={siteImages.moodboard}
                    alt="Custom photo strip templates and mood board"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="relative aspect-square overflow-hidden rounded-3xl film-frame">
                  <Image
                    src={siteImages.acrylicFrames}
                    alt="Acrylic magnetic photo keepsakes"
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="relative aspect-square overflow-hidden rounded-3xl film-frame">
                  <Image
                    src={siteImages.keychainStation}
                    alt="Custom photo keychain station"
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              </Reveal>
            </div>

            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">Keepsakes</p>
              <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
                Customization guests remember
              </h2>
              <p className="mt-6 text-taupe leading-relaxed">
                Overlays, monograms, brand colours, and launch messaging — woven into every strip so the booth
                feels unmistakably yours.
              </p>
              <p className="mt-4 text-taupe leading-relaxed">
                Physical prints, digital galleries, and optional upgrades (like magnetic keepsakes) vary by
                package. We will walk you through what fits your celebration during booking.
              </p>
              <ButtonLink href="/pricing" variant="secondary" className="mt-8">
                Explore packages
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="bg-porcelain section-y-lg">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">Where we show up</p>
            <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">Celebrations across Saskatoon &amp; beyond</h2>
            <p className="mx-auto mt-4 max-w-2xl text-taupe leading-relaxed">
              Weddings, corporate galas, school milestones, product launches, and community festivals — we travel
              throughout the region by arrangement.
            </p>
          </Reveal>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {audiences.map((a, i) => (
              <Reveal key={a.label} delay={i * 0.04}>
                <li>
                  <Link
                    href={a.href}
                    className="inline-block rounded-full border border-ink/15 bg-ivory px-5 py-2.5 text-sm text-ink transition-colors hover:border-champagne hover:bg-sand/40"
                  >
                    {a.label}
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink section-y-lg text-porcelain">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">Next step</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Let&apos;s plan your event</h2>
            <p className="mt-5 text-porcelain/80 leading-relaxed">
              Tell us about your date, venue, and vibe. We will confirm availability and help you choose the
              right package for your guests.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="/booking" variant="light">
                Check availability
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Contact us
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
