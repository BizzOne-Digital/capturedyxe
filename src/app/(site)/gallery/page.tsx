import Image from "next/image";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { Reveal } from "@/components/motion/Reveal";
import { getPublishedGallery } from "@/lib/data/public";
import { siteImages } from "@/lib/site-images";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const items = await getPublishedGallery();

  return (
    <>
      <section className="relative min-h-[40vh] w-full max-w-full overflow-hidden">
        <Image
          src={siteImages.boothGalleryArch}
          alt="Captured.YXE photo booth styling"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/60 to-transparent" />
        <div className="relative mx-auto flex min-h-[40vh] max-w-7xl items-end px-4 pb-12 md:px-8">
          <Reveal>
            <h1 className="font-display text-5xl md:text-6xl">Gallery</h1>
            <p className="mt-4 max-w-2xl text-taupe">
              Setups, keepsakes, and celebration styling from the Captured.YXE experience.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto w-full min-w-0 max-w-7xl px-4 md:px-8">
          <GalleryGrid items={items} />
        </div>
      </section>
    </>
  );
}
