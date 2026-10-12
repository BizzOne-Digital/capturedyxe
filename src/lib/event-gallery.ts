/**
 * Curated event photos under `public/gallery/events/` (web-sized only).
 * File list: `src/data/event-gallery-staged.json` (updated by `npm run stage-event-gallery`).
 */

import stagedFiles from "@/data/event-gallery-staged.json";

export type EventGalleryImage = {
  imageUrl: string;
  alt: string;
  caption?: string;
};

export type EventGalleryAlbum = {
  slug: string;
  title: string;
  dateLabel?: string;
  category: "wedding" | "corporate" | "milestone" | "festival" | "general";
  description: string;
  images: EventGalleryImage[];
};

const albumMeta: Record<
  string,
  Omit<EventGalleryAlbum, "slug" | "images">
> = {
  "amber-yehya": {
    title: "Amber & Yehya",
    dateLabel: "September 27, 2026",
    category: "wedding",
    description: "Wedding celebration — guest prints and booth moments from Captured.YXE.",
  },
  celebrations: {
    title: "On the floor",
    category: "general",
    description:
      "Setups and guest moments from weddings, festivals, and celebrations across Saskatoon.",
  },
};

const imageMeta: Record<string, Record<string, { alt: string; caption: string }>> = {
  celebrations: {
    "booth-venue.jpg": {
      alt: "Captured.YXE wooden tripod photo booth with ring light in a styled venue",
      caption: "Signature booth setup",
    },
    "wedding-reception.jpg": {
      alt: "Photo booth beside an elegant wedding reception",
      caption: "Wedding reception",
    },
    "outdoor-festival.jpg": {
      alt: "Outdoor photo booth under a garden gazebo at a community event",
      caption: "Outdoor & festival events",
    },
  },
};

function buildImages(slug: string, title: string, files: string[]): EventGalleryImage[] {
  const meta = imageMeta[slug] ?? {};
  return files.map((file, index) => {
    const custom = meta[file];
    if (custom) {
      return {
        imageUrl: `/gallery/events/${slug}/${file}`,
        alt: custom.alt,
        caption: custom.caption,
      };
    }
    return {
      imageUrl: `/gallery/events/${slug}/${file}`,
      alt: `${title} — photo booth moment ${index + 1}`,
      caption: files.length > 1 ? `Moment ${index + 1}` : undefined,
    };
  });
}

export const eventGalleryAlbums: EventGalleryAlbum[] = Object.entries(albumMeta).map(
  ([slug, meta]) => {
    const files = (stagedFiles as Record<string, string[]>)[slug] ?? [];
    return {
      slug,
      ...meta,
      images: buildImages(slug, meta.title, files),
    };
  }
);

export function getPublishedEventAlbums(): EventGalleryAlbum[] {
  return eventGalleryAlbums.filter((a) => a.images.length > 0);
}

export function eventGalleryToPreviewItems() {
  const items: {
    imageUrl: string;
    alt: string;
    caption: string;
    category: EventGalleryAlbum["category"];
    designation: "event";
  }[] = [];

  for (const album of eventGalleryAlbums) {
    for (const img of album.images) {
      items.push({
        imageUrl: img.imageUrl,
        alt: img.alt,
        caption: img.caption ? `${album.title} — ${img.caption}` : album.title,
        category: album.category,
        designation: "event",
      });
    }
  }
  return items;
}
