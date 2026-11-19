import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getVisibleBrands } from "@/lib/data/public";
import { safeImageSrc } from "@/lib/image-src";

export const metadata = {
  title: "Brands We Worked With",
  description: "Brands and organizations that have trusted Captured.YXE with their events in Saskatoon.",
};

export const dynamic = "force-dynamic";

function safeWebsite(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol) ? u.toString() : null;
  } catch {
    return null;
  }
}

export default async function BrandsPage() {
  const brands = await getVisibleBrands();

  return (
    <>
      <section className="border-b border-ink/8 bg-ivory py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <Reveal>
            <h1 className="font-display text-5xl">Brands we worked with</h1>
            <p className="mt-4 text-taupe">
              Businesses and organizations that have trusted us to make their events memorable.
            </p>
          </Reveal>
        </div>
      </section>

      {brands.length === 0 ? (
        <section className="section-y">
          <div className="mx-auto max-w-xl px-4 text-center text-sm text-taupe">
            Our brand partners will be listed here soon.
          </div>
        </section>
      ) : (
        <section className="section-y">
          <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-8">
            {brands.map((brand, i) => {
              const photos = brand.photos ?? [];
              const website = safeWebsite(brand.websiteUrl);
              const meta = [brand.industry, brand.eventType, brand.location, brand.eventDate].filter(Boolean);
              return (
                <Reveal key={brand._id} delay={Math.min(i, 4) * 0.05}>
                  <article className="rounded-3xl border border-ink/10 bg-porcelain p-6 md:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      {brand.logoUrl && (
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-white">
                          <Image
                            src={safeImageSrc(brand.logoUrl)}
                            alt={`${brand.name} logo`}
                            fill
                            sizes="96px"
                            className="object-contain p-2"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h2 className="font-display text-3xl">{brand.name}</h2>
                        {meta.length > 0 && <p className="mt-1 text-sm text-champagne">{meta.join(" · ")}</p>}
                        {website && (
                          <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-sm text-taupe underline hover:text-ink"
                          >
                            Visit website
                          </a>
                        )}
                      </div>
                    </div>
                    {brand.description && (
                      <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-taupe">
                        {brand.description}
                      </p>
                    )}
                    {photos.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {photos.map((url, n) => (
                          <div key={url} className="relative aspect-square overflow-hidden rounded-xl bg-sand/40">
                            <Image
                              src={safeImageSrc(url)}
                              alt={`${brand.name} event photo ${n + 1}`}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      <section className="section-y text-center">
        <ButtonLink href="/booking">Work with us</ButtonLink>
      </section>
    </>
  );
}
