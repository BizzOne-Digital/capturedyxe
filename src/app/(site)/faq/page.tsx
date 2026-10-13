import Image from "next/image";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getPublishedFaqs } from "@/lib/data/public";
import { siteImages } from "@/lib/site-images";

export const metadata = { title: "FAQ" };

export default async function FaqPage() {
  const faqs = await getPublishedFaqs();

  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <Reveal>
              <h1 className="font-display text-5xl">Frequently asked questions</h1>
              <p className="mt-4 text-taupe">
                Answers reflect what we can confirm today. For deposits, cancellations, travel, outdoor setup, or
                dimensions, please enquire — we will share approved details.
              </p>
            </Reveal>
            <div className="relative mt-10 hidden aspect-[3/4] overflow-hidden rounded-3xl film-frame lg:block">
              <Image
                src={siteImages.customGuestBook}
                alt="Personalized wooden guest book keepsake"
                fill
                className="object-cover"
                sizes="35vw"
              />
            </div>
          </div>
          <div>
            <FaqAccordion items={faqs} />
            <div className="mt-12 text-center lg:text-left">
              <ButtonLink href="/contact" variant="secondary">Still have questions?</ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
