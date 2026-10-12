import Image from "next/image";
import { EventGallerySections } from "@/components/site/EventGallerySections";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { Reveal } from "@/components/motion/Reveal";
import { getPublishedGallery } from "@/lib/data/public";
import { getPublishedEventAlbums } from "@/lib/event-gallery";
export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const [items, eventAlbums] = await Promise.all([
    getPublishedGallery(),
    Promise.resolve(getPublishedEventAlbums()),
  ]);

  const inspirationItems = items.filter((i) => i.designation !== "event");

  return (
    <>
      <section className="relative min-h-[28vh] w-full max-w-full overflow-hidden md:min-h-[40vh]">
        <Image
          src="/hero-booth.jpg"
          alt="Captured.YXE photo booth styling"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/60 to-transparent" />
        <div className="relative mx-auto flex min-h-[28vh] max-w-7xl items-end px-4 pb-8 md:min-h-[40vh] md:pb-12 md:px-8">
          <Reveal>
            <h1 className="font-display text-5xl md:text-6xl">Gallery</h1>
            <p className="mt-4 max-w-2xl text-taupe">
              Setups, keepsakes, and celebration styling from the Captured.YXE experience.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="border-b border-ink/8 bg-ivory section-y">
        <div className="mx-auto w-full min-w-0 max-w-7xl px-4 md:px-8">
          <EventGallerySections albums={eventAlbums} />
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto w-full min-w-0 max-w-7xl px-4 md:px-8">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl">Setups & styling</h2>
            <p className="mt-3 max-w-2xl text-sm text-taupe">
              Booth details, backdrops, and inspiration from across weddings, corporate events, and
              celebrations.
            </p>
          </Reveal>
          <div className="mt-10">
            <GalleryGrid items={inspirationItems.length > 0 ? inspirationItems : items} />
          </div>
        </div>
      </section>
    </>
  );
}
