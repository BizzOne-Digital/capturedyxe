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

export async function getSiteSettings() {
  if (!isDatabaseConfigured()) {
    return previewSettings;
  }
  await connectDB();
  let doc = await SiteSettings.findOne({ singletonKey: "main" }).lean();
  if (!doc) {
    doc = (await SiteSettings.create({})).toObject();
  }
  const plain = toPlain(doc);
  return {
    ...plain,
    instagramUrl: validSocialUrl(plain.instagramUrl) ?? "",
    facebookUrl: validSocialUrl(plain.facebookUrl) ?? "",
  };
}

export async function getPublishedServices() {
  if (!isDatabaseConfigured()) {
    return previewServices;
  }
  await connectDB();
  const docs = await Service.find({ status: "published" }).sort({ order: 1 }).lean();
  return toPlain(docs);
}

export async function getActivePackages() {
  if (!isDatabaseConfigured()) {
    return previewPackages;
  }
  await connectDB();
  const docs = await Package.find({ active: true }).sort({ order: 1 }).lean();
  return toPlain(docs);
}

export async function getActiveAddOns() {
  if (!isDatabaseConfigured()) {
    return previewAddOns;
  }
  await connectDB();
  const docs = await AddOn.find({ active: true }).sort({ order: 1 }).lean();
  return toPlain(docs);
}

export async function getPublishedFaqs() {
  if (!isDatabaseConfigured()) {
    return previewFaqs;
  }
  await connectDB();
  const docs = await FAQ.find({ status: "published" }).sort({ category: 1, order: 1 }).lean();
  return toPlain(docs);
}

export async function getPublishedTestimonials() {
  if (!isDatabaseConfigured()) {
    return [];
  }
  await connectDB();
  const docs = await Testimonial.find({ status: "published" }).sort({ order: 1 }).lean();
  return toPlain(docs);
}

export async function getPublishedGallery() {
  if (!isDatabaseConfigured()) {
    return previewGallery;
  }
  await connectDB();
  const docs = await GalleryItem.find({ status: "published" }).sort({ order: 1 }).lean();
  return toPlain(docs);
}

export async function getVisibleTeam() {
  if (!isDatabaseConfigured()) {
    return [];
  }
  await connectDB();
  const docs = await TeamMember.find({ visible: true }).sort({ order: 1 }).lean();
  return toPlain(docs);
}

export async function getVisibleOffer() {
  if (!isDatabaseConfigured()) {
    return previewOffer;
  }
  await connectDB();
  const doc = await Offer.findOne({ slug: "christmas-party", visible: true, active: true }).lean();
  return doc ? toPlain(doc) : null;
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
