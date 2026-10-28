import Image from "next/image";
import Link from "next/link";
import { HeroHome } from "@/components/site/HeroHome";
import { PackageCards } from "@/components/site/PackageCards";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { HomeMotionShell } from "@/components/motion/HomeMotionShell";
import { HomeMosaicGrid } from "@/components/motion/HomeMosaicGrid";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { ScrollMarquee } from "@/components/motion/ScrollMarquee";
import { variantCycle } from "@/components/motion/variants";
import { ButtonLink } from "@/components/ui/Button";
import {
  getActivePackages,
  getPublishedFaqs,
  getPublishedGallery,
  getSiteSettings,
  getVisibleOffer,
} from "@/lib/data/public";
import { formatCadWithTaxNote } from "@/lib/money";
import { getSiteUrl } from "@/lib/site-url";
import { siteImages } from "@/lib/site-images";
import { fetchGooglePlaceReviews } from "@/lib/google-place";

export const metadata = {
  title: "Home",
  description:
    "Capture Moments into Memories — Saskatoon photo booth rentals for weddings, corporate events, and celebrations.",
  alternates: { canonical: getSiteUrl() },
};

const pillars = [
  {
    title: "Retro Style Meets Modern Tech",
    body: "Crafted wooden tripods, clean aesthetics, and studio-grade lighting paired with professional DSLR capture.",
  },
  {
    title: "Prints and Digital Sharing",
    body: "Physical keepsakes and digital copies so guests can relive the night long after the music stops.",
  },
  {
    title: "Custom-Tailored for Your Vibe",
    body: "Custom overlays, styled backdrops, and curated props that reflect your wedding, brand, or milestone.",
  },
  {
    title: "Celebrations Across YXE",
    body: "From intimate weddings to corporate galas and community festivals — we bring the energy to you.",
  },
];

const audiences = [
  "Weddings",
  "Corporate events",
  "Personal milestones",
  "Product launches",
  "School events",
  "Public festivals",
];

export default async function HomePage() {
  const settings = await getSiteSettings();
  const packages = await getActivePackages();
  const gallery = await getPublishedGallery();
  const faqs = await getPublishedFaqs();
  const googleReviews = await fetchGooglePlaceReviews();
  const kindWords = (googleReviews?.reviews ?? []).slice(0, 2).map((r) => ({
    id: `google-${r.author}-${r.publishTime}`,
    quote: r.text,
    reviewerName: r.author,
    fromGoogle: true,
  }));
  const offer = await getVisibleOffer();
  const faqPreview = faqs.slice(0, 4);

  return (
    <HomeMotionShell>
      <HeroHome
        headline={settings.headline}
        subheadline={settings.subheadline}
        heroImageUrl={settings.heroImageUrl || "/hero-booth.jpg"}
        startingPriceCents={settings.startingPriceCents}
        ctaPrimary={settings.ctaPrimaryLabel}
        ctaSecondary={settings.ctaSecondaryLabel}
      />

      <section className="relative overflow-hidden bg-ink section-y text-porcelain">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(181,150,112,0.15),transparent_45%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <Reveal variant="zoom">
            <p className="text-xs uppercase tracking-[0.25em] text-champagne">For every celebration</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Built for the moments that matter</h2>
          </Reveal>
          <ScrollMarquee items={audiences} />
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-2">
          <Reveal variant="left">
            <h2 className="font-display text-4xl md:text-5xl">Signature wooden-tripod presence</h2>
            <p className="mt-6 text-taupe leading-relaxed">
              Our modern-retro setups blend into your venue while standing out for the right reasons — warm
              materials, thoughtful styling, and a booth experience guests actually line up for.
            </p>
            <p className="mt-4 text-taupe leading-relaxed">
              Professional DSLR cameras and studio-grade lighting keep every frame flattering, whether you are
              celebrating in a ballroom or a converted warehouse.
            </p>
            <ButtonLink href="/about" variant="secondary" className="mt-8">
              Our Story
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.12} variant="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl film-frame">
              <Image
                src={siteImages.weddingBanquet}
                alt="Guests celebrating at a wedding reception photo booth"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <HomeMosaicGrid
          shots={[
            { src: siteImages.photoStrips, alt: "Printed photo strips" },
            { src: siteImages.archBackdrop, alt: "Arched floral backdrop" },
            { src: siteImages.acrylicFrames, alt: "Acrylic magnetic frames" },
            { src: siteImages.propsFlatlay, alt: "Curated booth props" },
          ]}
        />
      </section>

      <section className="bg-sand/40 section-y">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <h2 className="font-display text-center text-4xl md:text-5xl">The Captured.YXE difference</h2>
          </Reveal>
          <StaggerGroup className="mt-12 grid gap-8 md:grid-cols-2" stagger={0.12}>
            {pillars.map((p, i) => (
              <StaggerItem key={p.title} variant={variantCycle[i % variantCycle.length]}>
                <article className="lift-card rounded-3xl border border-ink/10 bg-porcelain p-8 transition-shadow hover:shadow-[0_20px_50px_rgba(25,25,25,0.12)]">
                  <h3 className="font-display text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-taupe">{p.body}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <h2 className="font-display text-4xl md:text-5xl">Packages</h2>
              <p className="mt-3 max-w-xl text-taupe">
                Standard, Signature, and Elite experiences — starting from{" "}
                {formatCadWithTaxNote(settings.startingPriceCents)}. Final quotes depend on your package and
                requested extras.
              </p>
            </Reveal>
            <ButtonLink href="/pricing" variant="secondary">View Pricing</ButtonLink>
          </div>
          <div className="mt-10">
            <PackageCards
              packages={packages}
              showPrices={settings.showPublicPackagePrices}
            />
          </div>
        </div>
      </section>

      <section className="bg-ink section-y text-porcelain">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <h2 className="font-display text-4xl">Gallery</h2>
            <p className="mt-2 text-porcelain/70 text-sm">Setups, keepsakes, and celebrations across YXE.</p>
          </Reveal>
          <div className="mt-8 [&_button]:border-porcelain/20">
            <GalleryGrid items={gallery.slice(0, 6)} theme="dark" />
          </div>
          <ButtonLink href="/gallery" variant="ghost" className="mt-8">
            View Full Gallery
          </ButtonLink>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <h2 className="font-display text-center text-4xl">How it works</h2>
          </Reveal>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { step: "Inquire", text: "Share your date, venue, and vision — we will confirm availability with you." },
              { step: "Personalize", text: "Choose templates, backdrops, and extras that match your celebration." },
              { step: "Celebrate", text: "We handle setup, guest flow, and on-site support while you enjoy the night." },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <li className="text-center">
                  <span className="step-number font-display text-5xl text-champagne" style={{ animationDelay: `${i * 0.4}s` }}>{i + 1}</span>
                  <h3 className="mt-4 font-display text-2xl">{s.step}</h3>
                  <p className="mt-2 text-sm text-taupe">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-porcelain section-y border-y border-ink/5">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
          <Reveal>
            <h2 className="font-display text-4xl">Kind words</h2>
            {kindWords.length === 0 ? (
              <p className="mt-6 text-taupe">Reviews will appear here soon.</p>
            ) : (
              <div className="mt-8 space-y-6 text-left">
                {kindWords.map((t) => (
                  <blockquote key={t.id} className="rounded-2xl border border-ink/10 p-6">
                    <p className="whitespace-pre-line text-ink">&ldquo;{t.quote}&rdquo;</p>
                    <footer className="mt-3 text-sm text-taupe">— {t.reviewerName}</footer>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-champagne/80">
                      Posted on Google
                    </p>
                  </blockquote>
                ))}
                {(googleReviews?.reviews?.length ?? 0) > 2 ? (
                  <p className="text-center text-sm text-taupe">
                    <Link href="/testimonials" className="text-ink underline underline-offset-4">
                      See all testimonials
                    </Link>
                  </p>
                ) : null}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <Reveal>
            <h2 className="font-display text-4xl">Questions</h2>
            <Link href="/faq" className="mt-2 inline-block text-sm text-champagne hover:underline">
              Full FAQ
            </Link>
          </Reveal>
          <div className="mt-8">
            <FaqAccordion items={faqPreview} />
          </div>
        </div>
      </section>

      {offer && (
        <section className="relative w-full max-w-full overflow-hidden py-12 md:py-16">
          <Image
            src={siteImages.christmasParty}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            aria-hidden
          />
          <div className="absolute inset-0 bg-ivory/88" aria-hidden />
          <div className="relative mx-auto w-[calc(100%-2rem)] max-w-4xl rounded-3xl border border-champagne/30 bg-porcelain/95 px-5 py-10 text-center sm:w-full sm:px-6 md:px-12">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-champagne">Seasonal offer</p>
              <h2 className="mt-3 font-display text-3xl">{offer.title}</h2>
              <p className="mt-3 text-taupe">{offer.description}</p>
              {offer.eligibility && (
                <p className="mt-2 text-xs text-taupe">{offer.eligibility}</p>
              )}
              <ButtonLink href="/booking" className="mt-6">Check Availability</ButtonLink>
            </Reveal>
          </div>
        </section>
      )}

      <section className="bg-ink py-24 text-center text-porcelain">
        <div className="mx-auto max-w-2xl px-4">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl">Ready to capture your celebration?</h2>
            <p className="mt-4 text-porcelain/80">
              Request availability for your date — our team will follow up to confirm details and next steps.
            </p>
            <ButtonLink href="/booking" variant="light" className="mt-8">
              Check Availability
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </HomeMotionShell>
  );
}
