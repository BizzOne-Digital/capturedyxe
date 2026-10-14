import Image from "next/image";
import { ExperiencePhotoWall } from "@/components/motion/ExperiencePhotoWall";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getPublishedServices } from "@/lib/data/public";
import { experienceGalleryShots } from "@/lib/experience-gallery";

export const metadata = {
  title: "Experiences & Services",
  description:
    "Modern-retro photo booth experiences with backdrops, props, custom templates, prints, and digital sharing for every celebration.",
};

const experienceBullets = [
  "Modern-retro photo booth experience with professional on-site support",
  "Styled backdrops and curated props",
  "Customized photo strip templates",
  "Digital photo copies for guests",
  "Print options and optional keepsakes — varies by package",
];

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <>
      <section className="section-y bg-porcelain border-b border-ink/5">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <h1 className="font-display text-5xl md:text-6xl">The experience</h1>
            <p className="mt-6 max-w-2xl text-lg text-taupe">
              A polished booth presence, warm lighting, and templates tailored to your event — without the
              chaos of a phone-only photo corner.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 max-w-3xl">
            {experienceBullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-taupe">
                <span className="text-champagne">—</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink section-y text-porcelain">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(181,150,112,0.2),transparent_50%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <Reveal variant="zoom">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">Real celebrations</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Guests in the booth</h2>
            <p className="mt-4 max-w-2xl text-porcelain/80">
              Birthdays, weddings, and nights out — the energy your guests bring is half the experience.
            </p>
          </Reveal>
          <div className="mt-10">
            <ExperiencePhotoWall shots={experienceGalleryShots} />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-12 md:space-y-20">
          {services.map((svc, i) => (
            <Reveal key={String(svc._id)}>
              <article
                id={svc.slug}
                className={`scroll-mt-28 grid gap-10 lg:grid-cols-12 items-center ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <h2 className="font-display text-4xl">{svc.title}</h2>
                  <p className="mt-4 text-taupe">{svc.description}</p>
                  <ul className="mt-6 space-y-2 text-sm text-taupe">
                    {svc.features?.map((f: string) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                  <ButtonLink
                    href={svc.audience === "wedding" ? "/weddings" : svc.audience === "corporate" ? "/corporate-events" : "/booking"}
                    variant="secondary"
                    className="mt-8"
                  >
                    Plan this experience
                  </ButtonLink>
                </div>
                <div className={`lg:col-span-7 relative aspect-[16/10] rounded-3xl overflow-hidden film-frame ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  {svc.imageUrl && (
                    <Image
                      src={svc.imageUrl}
                      alt={svc.imageAlt || svc.title}
                      fill
                      className="object-cover"
                      sizes="60vw"
                    />
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
