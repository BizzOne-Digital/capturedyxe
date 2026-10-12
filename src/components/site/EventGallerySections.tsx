import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import type { EventGalleryAlbum } from "@/lib/event-gallery";

export function EventGallerySections({ albums }: { albums: EventGalleryAlbum[] }) {
  if (albums.length === 0) return null;

  return (
    <div className="space-y-12 md:space-y-16">
      {albums.map((album, albumIndex) => (
        <section key={album.slug} aria-labelledby={`event-gallery-${album.slug}`}>
          <Reveal delay={albumIndex * 0.05}>
            <div className="max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">
                Event gallery
              </p>
              <h2
                id={`event-gallery-${album.slug}`}
                className="mt-2 font-display text-3xl text-ink md:text-4xl"
              >
                {album.title}
              </h2>
              {album.dateLabel && (
                <p className="mt-1 text-sm text-taupe">{album.dateLabel}</p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-taupe">{album.description}</p>
            </div>
          </Reveal>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {album.images.map((img, i) => (
              <Reveal key={img.imageUrl} delay={0.04 * i}>
                <li className="overflow-hidden rounded-2xl border border-ink/10 bg-porcelain film-frame">
                  <Image
                    src={img.imageUrl}
                    alt={img.alt}
                    width={900}
                    height={1200}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  {img.caption && (
                    <p className="px-4 py-3 text-xs text-taupe">{img.caption}</p>
                  )}
                </li>
              </Reveal>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
