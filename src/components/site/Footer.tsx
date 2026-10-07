import Link from "next/link";
import { SiteLogo } from "@/components/site/SiteLogo";
import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

type FooterProps = {
  siteName: string;
  email: string;
  phone: string;
  phoneTel: string;
  serviceArea: string;
  instagram: string | null;
  facebook: string | null;
};

const linkGroups = [
  {
    title: "Experiences",
    links: [
      { href: "/services", label: "All experiences" },
      { href: "/weddings", label: "Weddings" },
      { href: "/corporate-events", label: "Corporate events" },
      { href: "/gallery", label: "Gallery" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/our-team", label: "Our team" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Book",
    links: [
      { href: "/booking", label: "Check availability" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer({
  siteName,
  email,
  phone,
  phoneTel,
  serviceArea,
  instagram,
  facebook,
}: FooterProps) {
  return (
    <footer className="w-full max-w-full overflow-x-clip border-t border-ink/10 bg-ivory">
      {/* CTA band */}
      <div className="border-b border-ink/8 bg-porcelain">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">
              Saskatoon &amp; beyond
            </p>
            <p className="mt-2 font-display text-2xl text-ink md:text-3xl">
              Ready to capture your celebration?
            </p>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-porcelain transition-colors hover:bg-ink/90"
          >
            Check availability
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="bg-ink text-porcelain">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-16">
          <div className="grid w-full min-w-0 grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-block" aria-label={siteName}>
                <SiteLogo siteName={siteName} variant="footer" />
              </Link>
              <p className="mt-6 flex gap-2 text-sm leading-relaxed text-porcelain/75">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden />
                <span>{serviceArea}</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <a
                    href={phoneTel}
                    className="inline-flex items-center gap-2.5 text-porcelain/90 transition-colors hover:text-champagne"
                  >
                    <Phone className="h-4 w-4 text-champagne" aria-hidden />
                    {phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2.5 break-all text-porcelain/90 transition-colors hover:text-champagne"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
                    {email}
                  </a>
                </li>
              </ul>
              {(instagram || facebook) && (
                <div className="mt-8 flex gap-2">
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm border border-porcelain/15 p-2.5 text-porcelain/80 transition-colors hover:border-champagne hover:text-champagne"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm border border-porcelain/15 p-2.5 text-porcelain/80 transition-colors hover:border-champagne hover:text-champagne"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Link columns */}
            <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
              {linkGroups.map((group) => (
                <div key={group.title}>
                  <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-champagne">
                    {group.title}
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-porcelain/80 transition-colors hover:text-porcelain"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-porcelain/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center md:flex-row md:px-8 md:text-left">
            <p className="text-xs text-porcelain/45">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-porcelain/40">
              Weddings
              <span className="mx-2 text-porcelain/25" aria-hidden>/</span>
              Corporate events
              <span className="mx-2 text-porcelain/25" aria-hidden>/</span>
              Celebrations
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
