import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { toPlain } from "@/lib/serialize";
import {
  PREVIEW_MODE,
  previewAddOns,
  previewFaqs,
  previewGallery,
  previewOffer,
  previewPackages,
  previewServices,
  previewTestimonials,
  previewSettings,
} from "@/lib/preview-data";
import { SiteSettings } from "@/models/SiteSettings";
import { Service } from "@/models/Service";
import { Package } from "@/models/Package";
import { AddOn } from "@/models/AddOn";
import { FAQ } from "@/models/FAQ";
import { Testimonial } from "@/models/Testimonial";
import { GalleryItem } from "@/models/GalleryItem";
import { TeamMember } from "@/models/TeamMember";
import { Offer } from "@/models/Offer";
import { PageContent } from "@/models/PageContent";
import type {
  PublicFaq,
  PublicGalleryItem,
  PublicOffer,
  PublicPackage,
  PublicService,
  SiteSettingsRecord,
} from "@/lib/data/types";

function validSocialUrl(url: string | undefined | null): string | null {
  if (!url?.trim()) return null;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return url;
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettingsRecord> {
  if (!isDatabaseConfigured()) {
    return previewSettings as SiteSettingsRecord;
  }
  await connectDB();
  let doc = await SiteSettings.findOne({ singletonKey: "main" }).lean();
  if (!doc) {
    doc = (await SiteSettings.create({})).toObject();
  }
  const plain = toPlain(doc) as unknown as SiteSettingsRecord;
  return {
    ...plain,
    instagramUrl: validSocialUrl(plain.instagramUrl) ?? "",
    facebookUrl: validSocialUrl(plain.facebookUrl) ?? "",
  };
}

export async function getPublishedServices(): Promise<PublicService[]> {
  if (!isDatabaseConfigured()) {
    return previewServices as PublicService[];
  }
  await connectDB();
  const docs = await Service.find({ status: "published" }).sort({ order: 1 }).lean();
  return toPlain(docs) as unknown as PublicService[];
}

export async function getActivePackages(): Promise<PublicPackage[]> {
  if (!isDatabaseConfigured()) {
    return previewPackages as PublicPackage[];
  }
  await connectDB();
  const docs = await Package.find({ active: true }).sort({ order: 1 }).lean();
  return toPlain(docs) as unknown as PublicPackage[];
}

export async function getActiveAddOns() {
  if (!isDatabaseConfigured()) {
    return previewAddOns;
  }
  await connectDB();
  const docs = await AddOn.find({ active: true }).sort({ order: 1 }).lean();
  return toPlain(docs);
}

export async function getPublishedFaqs(): Promise<PublicFaq[]> {
  if (!isDatabaseConfigured()) {
    return previewFaqs as PublicFaq[];
  }
  await connectDB();
  const docs = await FAQ.find({ status: "published" }).sort({ category: 1, order: 1 }).lean();
  return toPlain(docs) as unknown as PublicFaq[];
}

export type PublicTestimonial = {
  _id: string;
  reviewerName: string;
  quote: string;
  eventCategory?: string;
};

export async function getPublishedTestimonials(): Promise<PublicTestimonial[]> {
  if (!isDatabaseConfigured()) {
    return previewTestimonials as PublicTestimonial[];
  }
  await connectDB();
  const docs = await Testimonial.find({ status: "published" }).sort({ order: 1 }).lean();
  const items = toPlain(docs) as unknown as PublicTestimonial[];
  if (items.length === 0) {
    return previewTestimonials as PublicTestimonial[];
  }
  return items;
}

export async function getPublishedGallery(): Promise<PublicGalleryItem[]> {
  if (!isDatabaseConfigured()) {
    return previewGallery as PublicGalleryItem[];
  }
  await connectDB();
  const docs = await GalleryItem.find({ status: "published" }).sort({ order: 1 }).lean();
  return toPlain(docs) as unknown as PublicGalleryItem[];
}

export type PublicTeamMember = {
  _id: string;
  name: string;
  role: string;
  biography?: string;
  imageUrl?: string;
};

export async function getVisibleTeam(): Promise<PublicTeamMember[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }
  await connectDB();
  const docs = await TeamMember.find({ visible: true }).sort({ order: 1 }).lean();
  return toPlain(docs) as unknown as PublicTeamMember[];
}

export async function getVisibleOffer(): Promise<PublicOffer | null> {
  if (!isDatabaseConfigured()) {
    return previewOffer as PublicOffer;
  }
  await connectDB();
  const doc = await Offer.findOne({ slug: "christmas-party", visible: true, active: true }).lean();
  return doc ? (toPlain(doc) as unknown as PublicOffer) : null;
}

export async function getPageContent(pageKey: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  await connectDB();
  const doc = await PageContent.findOne({ pageKey }).lean();
  return doc ? toPlain(doc) : null;
}

export function isPreviewMode() {
  return PREVIEW_MODE;
}

export function getPublicSocialLinks(settings: {
  instagramUrl?: string;
  facebookUrl?: string;
}) {
  return {
    instagram: validSocialUrl(settings.instagramUrl),
    facebook: validSocialUrl(settings.facebookUrl),
  };
}
