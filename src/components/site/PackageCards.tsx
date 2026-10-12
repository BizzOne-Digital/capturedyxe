import { ButtonLink } from "@/components/ui/Button";
import { formatCadWithTaxNote } from "@/lib/money";
import { Reveal } from "@/components/motion/Reveal";

type Inclusion = {
  label: string;
  publiclyVisible?: boolean;
  needsClientConfirmation?: boolean;
};

type Pkg = {
  _id: string;
  name: string;
  slug: string;
  tier: string;
  priceCents: number;
  durationHours: number;
  shortDescription?: string;
  showPricePublicly?: boolean;
  inclusions?: Inclusion[];
};

export function PackageCards({
  packages,
  showPrices,
}: {
  packages: Pkg[];
  showPrices: boolean;
}) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-3">
      {packages.map((pkg, i) => {
        const visibleInclusions =
          pkg.inclusions?.filter((inc) => inc.publiclyVisible !== false) ?? [];
        return (
          <Reveal key={pkg._id} delay={i * 0.08}>
            <article
              className="flex h-full min-w-0 flex-col rounded-3xl border border-ink/10 bg-porcelain p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-champagne">
                {pkg.durationHours} hours
              </p>
              <h3 className="mt-2 font-display text-3xl">{pkg.name}</h3>
              {pkg.shortDescription && (
                <p className="mt-2 text-sm text-taupe">{pkg.shortDescription}</p>
              )}
              {showPrices && pkg.showPricePublicly && (
                <p className="mt-4 text-lg font-medium">
                  {formatCadWithTaxNote(pkg.priceCents)}
                </p>
              )}
              <ul className="mt-6 flex-1 space-y-2 text-sm text-taupe">
                {visibleInclusions.map((inc) => (
                  <li key={inc.label} className="flex gap-2">
                    <span className="shrink-0 text-champagne">—</span>
                    <span>{inc.label}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/booking"
                variant="secondary"
                className="mt-8 w-full"
              >
                Request a Quote
              </ButtonLink>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
