import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

type FooterProps = {
  logoUrl: string;
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  phoneTel: string;
  serviceArea: string;
  instagram: string | null;
  facebook: string | null;
};

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/weddings", label: "Weddings" },
  { href: "/corporate-events", label: "Corporate" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/our-team", label: "Our Team" },
];

export function Footer({
  logoUrl,
  siteName,
  tagline,
  email,
  phone,
  phoneTel,
  serviceArea,
  instagram,
  facebook,
}: FooterProps) {
  return (
    <footer className="bg-ink text-porcelain">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-porcelain p-6 inline-block">
            <Image
              src={logoUrl}
              alt={siteName}
              width={220}
              height={64}
              className="h-14 w-auto"
            />
          </div>
          <p className="mt-4 max-w-md text-sm tracking-[0.2em] text-porcelain/70 uppercase">
            {tagline}
          </p>
          <p className="mt-4 max-w-md text-sm text-porcelain/80">{serviceArea}</p>
        </div>

        <div>
          <h2 className="font-display text-xl">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm text-porcelain/80">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-champagne transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl">Enquire</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={phoneTel}
                className="inline-flex items-center gap-2 hover:text-champagne transition-colors"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 hover:text-champagne transition-colors"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {email}
              </a>
            </li>
          </ul>
          {(instagram || facebook) && (
            <div className="mt-6 flex gap-3">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-porcelain/20 p-2 hover:border-champagne"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-porcelain/20 p-2 hover:border-champagne"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-porcelain/10 py-6 text-center text-xs text-porcelain/50">
        © {new Date().getFullYear()} {siteName}. Saskatoon, Saskatchewan.
      </div>
    </footer>
  );
}
