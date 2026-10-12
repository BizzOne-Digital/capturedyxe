import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { getPublicSocialLinks, getSiteSettings } from "@/lib/data/public";
import { siteImages } from "@/lib/site-images";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const social = getPublicSocialLinks(settings);

  return (
    <section className="section-y">
      <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-10 px-4 md:gap-16 md:px-8 lg:grid-cols-2">
        <Reveal>
          <h1 className="font-display text-5xl">Contact</h1>
          <p className="mt-4 text-taupe">We would love to hear about your celebration.</p>
          <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-3xl film-frame">
            <Image
              src={siteImages.moodboard}
              alt="Event planning mood board with photo prints"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <ul className="mt-10 space-y-4">
            <li>
              <a href={settings.phoneTel} className="inline-flex items-center gap-3 text-ink hover:text-champagne">
                <Phone className="h-5 w-5" aria-hidden />
                {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-3 text-ink hover:text-champagne">
                <Mail className="h-5 w-5" aria-hidden />
                {settings.email}
              </a>
            </li>
          </ul>
          <p className="mt-8 text-sm text-taupe">{settings.serviceArea}</p>
          {(social.instagram || social.facebook) && (
            <p className="mt-4 text-sm">
              {social.instagram && <a href={social.instagram} className="mr-4 underline">Instagram</a>}
              {social.facebook && <a href={social.facebook} className="underline">Facebook</a>}
            </p>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
