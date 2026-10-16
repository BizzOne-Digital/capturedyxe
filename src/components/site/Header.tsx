"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/site/SiteLogo";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import type { ExperienceNavLink } from "@/lib/experience-nav";
import { isExperienceNavActive, isExperiencesSectionActive } from "@/lib/experience-nav";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { type: "experiences" as const, label: "Experiences" },
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
  siteName: string;
  experienceLinks: ExperienceNavLink[];
};

function ExperiencesDropdown({
  pathname,
  experienceLinks,
}: {
  pathname: string;
  experienceLinks: ExperienceNavLink[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isActive = isExperiencesSectionActive(pathname, experienceLinks);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 text-sm font-medium text-ink/85 transition-colors hover:text-ink ${
          isActive ? "border-b border-ink pb-0.5 text-ink" : ""
        }`}
      >
        Experiences
        <ChevronDown
          className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <div
        role="menu"
        className={`absolute left-1/2 top-full z-[200] min-w-[14rem] max-w-[18rem] -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="max-h-[min(70vh,20rem)] overflow-y-auto overflow-x-hidden rounded-sm border border-ink/10 bg-porcelain shadow-[0_16px_48px_rgba(25,25,25,0.14)]">
          {experienceLinks.map((child) => (
            <Link
              key={child.slug}
              href={child.href}
              role="menuitem"
              className={`block px-4 py-2.5 text-sm text-ink transition-colors hover:bg-sand/60 ${
                isExperienceNavActive(pathname, child.href) ? "bg-sand/40 font-medium" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header({ siteName, experienceLinks }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileExpOpen, setMobileExpOpen] = useState(false);
  const reduce = useReducedMotion();

  const linkClass = (href: string) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `text-sm font-medium text-ink/85 transition-colors hover:text-ink ${
      active ? "border-b border-ink pb-0.5 text-ink" : ""
    }`;
  };

  return (
    <header
      className="sticky top-0 z-[100] isolate w-full max-w-full overflow-x-clip border-b border-ink/8 bg-ivory/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full min-w-0 max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:py-4 md:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4">
        <Link
          href="/"
          className="min-w-0 max-w-[calc(100%-2.75rem)] shrink sm:max-w-[78%] md:max-w-[320px] lg:max-w-none lg:justify-self-start"
          aria-label={siteName}
        >
          <SiteLogo siteName={siteName} variant="header" priority />
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-6 lg:flex xl:gap-8" aria-label="Primary">
          {nav.map((item) => {
            if (item.type === "experiences") {
              return (
                <ExperiencesDropdown
                  key={`experiences-${pathname}`}
                  pathname={pathname}
                  experienceLinks={experienceLinks}
                />
              );
            }
            return (
              <Link key={item.href} href={item.href!} className={linkClass(item.href!)}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 lg:justify-self-end">
          <Link
            href="/booking"
            className="hidden items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-porcelain transition-colors hover:bg-ink/90 lg:inline-flex"
          >
            Check Availability
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <button
            type="button"
            className="rounded-sm p-2 text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="max-h-[min(85vh,32rem)] overflow-y-auto border-t border-ink/8 bg-ivory px-4 py-4 lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {nav.map((item) => {
              if (item.type === "experiences") {
                return (
                  <div key="experiences-mobile" className="border-b border-ink/5 pb-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-ink"
                      aria-expanded={mobileExpOpen}
                      onClick={() => setMobileExpOpen((v) => !v)}
                    >
                      Experiences
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${mobileExpOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileExpOpen && (
                      <div className="mt-1 space-y-0.5 pl-3">
                        {experienceLinks.map((child) => (
                          <Link
                            key={child.slug}
                            href={child.href}
                            className="block rounded-sm px-3 py-2 text-sm text-taupe hover:text-ink"
                            onClick={() => {
                              setOpen(false);
                              setMobileExpOpen(false);
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="rounded-sm px-3 py-2.5 text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/booking"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-medium text-porcelain"
              onClick={() => setOpen(false)}
            >
              Check Availability
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 px-3 text-xs uppercase tracking-widest text-taupe">More</p>
            {footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm px-3 py-2 text-sm text-taupe"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
