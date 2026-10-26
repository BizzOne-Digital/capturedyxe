"use client";

import Image from "next/image";
import type { ExperienceGalleryShot } from "@/lib/experience-gallery";

export function ExperiencePhotoWall({ shots }: { shots: ExperienceGalleryShot[] }) {
  return (
    <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4 lg:gap-5">
      {shots.map((shot, i) => {
        const tall = i % 3 === 0;
        return (
          <figure
            key={shot.imageUrl}
            className="mb-3 break-inside-avoid overflow-hidden rounded-2xl film-frame md:mb-4"
          >
            <div className={`relative w-full ${tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
              <Image src={shot.imageUrl} alt={shot.alt} fill className="object-cover" sizes="25vw" />
            </div>
            {shot.caption ? (
              <figcaption className="mt-2 px-1 text-xs text-taupe">{shot.caption}</figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
