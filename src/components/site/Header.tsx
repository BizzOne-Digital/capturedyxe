"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    label: "Experiences",
    children: [
      { href: "/services", label: "All Experiences" },
      { href: "/weddings", label: "Weddings" },
      { href: "/corporate-events", label: "Corporate Events" },
    ],
  },
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
];

const footerNav = [
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Booking" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/our-team", label: "Our Team" },
];

type HeaderProps = {
  logoUrl: string;
  siteName: string;
};

export function Header({ logoUrl, siteName }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-porcelain/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={siteName}>
          <Image
            src={logoUrl}
            alt={siteName}
            width={180}
            height={48}
            className="h-10 w-auto object-contain md:h-11"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-ink/80 transition-colors hover:text-ink"
                  aria-expanded={expOpen}
                  onClick={() => setExpOpen((v) => !v)}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </button>
                <div
                  className="invisible absolute left-0 top-full z-50 min-w-[200px] translate-y-2 rounded-xl border border-ink/10 bg-porcelain p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 text-sm text-taupe hover:bg-sand/50 hover:text-ink"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className="text-sm text-ink/80 transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            )
          )}
          <ButtonLink href="/booking" className="!px-5 !py-2.5">
            Book Now
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/5 bg-porcelain px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {[...nav.flatMap((n) => (n.children ? n.children : [n]))].map((item) => (
              <Link
                key={item.href}
                href={item.href!}
                className="rounded-lg px-3 py-2.5 text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-3 px-3 text-xs uppercase tracking-widest text-taupe">More</p>
            {footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-taupe"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/booking" className="mt-4 w-full">
              Book Now
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
