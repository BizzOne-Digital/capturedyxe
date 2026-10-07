import type { PublicService } from "@/lib/data/types";

export type ExperienceNavLink = {
  href: string;
  label: string;
  slug: string;
};

const dedicatedServicePaths: Record<string, string> = {
  weddings: "/weddings",
  "corporate-events": "/corporate-events",
};

export function getServicePageHref(slug: string): string {
  return dedicatedServicePaths[slug] ?? `/services#${slug}`;
}

export function buildExperienceNavLinks(services: PublicService[]): ExperienceNavLink[] {
  const sorted = [...services].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return [
    { href: "/services", label: "All experiences", slug: "all" },
    ...sorted.map((svc) => ({
      href: getServicePageHref(svc.slug),
      label: svc.title,
      slug: svc.slug,
    })),
  ];
}

export function isExperienceNavActive(pathname: string, href: string): boolean {
  if (href === "/services") {
    return pathname === "/services";
  }
  const pathOnly = href.split("#")[0];
  return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);
}

export function isExperiencesSectionActive(pathname: string, links: ExperienceNavLink[]): boolean {
  return links.some((link) => isExperienceNavActive(pathname, link.href));
}
