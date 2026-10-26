"use client";

import Image from "next/image";

type Shot = { src: string; alt: string };

export function HomeMosaicGrid({ shots }: { shots: Shot[] }) {
  return (
    <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-2 gap-3 px-4 md:grid-cols-4 md:gap-4 md:px-8">
      {shots.map((shot) => (
        <div
          key={shot.src}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl film-frame md:aspect-[3/4]"
        >
          <Image src={shot.src} alt={shot.alt} fill className="object-cover" sizes="25vw" />
        </div>
      ))}
    </div>
  );
}
