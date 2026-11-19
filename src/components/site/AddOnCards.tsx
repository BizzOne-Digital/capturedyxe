import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { formatCadWithTaxNote } from "@/lib/money";
import { safeImageSrc } from "@/lib/image-src";

type AddOn = {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  priceCents: number;
  showPricePublicly?: boolean;
};

export function AddOnCards({
  addOns,
  showPrices,
}: {
  addOns: AddOn[];
  showPrices: boolean;
}) {
  if (addOns.length === 0) return null;

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
      {addOns.map((addon, i) => (
        <Reveal key={addon._id} delay={i * 0.06}>
          <article className="h-full overflow-hidden rounded-3xl border border-ink/10 bg-porcelain shadow-sm">
            {addon.imageUrl && (
              <div className="relative aspect-[16/10] w-full bg-sand/40">
                <Image
                  src={safeImageSrc(addon.imageUrl)}
                  alt={addon.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-champagne">Optional upgrade</p>
            <h3 className="mt-2 font-display text-2xl text-ink">{addon.name}</h3>
            {addon.description && (
              <p className="mt-2 text-sm leading-relaxed text-taupe">{addon.description}</p>
            )}
            {showPrices && addon.showPricePublicly !== false && (
              <p className="mt-4 text-lg font-medium text-ink">
                {formatCadWithTaxNote(addon.priceCents)}
              </p>
            )}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
