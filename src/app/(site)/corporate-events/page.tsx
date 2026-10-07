import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { siteImages } from "@/lib/site-images";

export const metadata = { title: "Corporate Events" };

export default function CorporateEventsPage() {
  return (
    <>
      <section className="w-full overflow-x-clip bg-ink py-16 text-porcelain md:py-24">
        <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-2">
          <Reveal>
            <h1 className="max-w-full font-display text-[clamp(2rem,6.5vw,3.75rem)]">
              Corporate &amp; community events
            </h1>
            <p className="mt-6 text-porcelain/80 leading-relaxed">
              Product launches, galas, school celebrations, and festivals — polished setups with custom
              templates and professional on-site support.
            </p>
            <ButtonLink href="/booking?eventType=Corporate%20Event" variant="light" className="mt-8">
              Check Availability
            </ButtonLink>
          </Reveal>
          <div className="relative aspect-video rounded-3xl overflow-hidden film-frame">
            <Image
              src={siteImages.corporateGala}
              alt="Photo booth at a corporate gala"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Custom templates",
                body: "Brand colours, logos, and launch messaging woven into every strip.",
              },
              {
                title: "Event styling",
                body: "Clean aesthetics that photograph well in trade show halls and hotel ballrooms alike.",
              },
              {
                title: "Guest experience",
                body: "Attentive hosts who keep the line moving and the energy high.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <article className="border-t-2 border-champagne pt-6">
                  <h2 className="font-display text-2xl">{c.title}</h2>
                  <p className="mt-3 text-sm text-taupe">{c.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
