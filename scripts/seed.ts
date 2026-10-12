import "dotenv/config";
import mongoose from "mongoose";
import {
  previewAddOns,
  previewFaqs,
  previewGallery,
  previewOffer,
  previewPackages,
  previewServices,
  previewSettings,
  previewTestimonials,
} from "../src/lib/preview-data";
import { Testimonial } from "../src/models/Testimonial";
import { SiteSettings } from "../src/models/SiteSettings";
import { Service } from "../src/models/Service";
import { Package } from "../src/models/Package";
import { AddOn } from "../src/models/AddOn";
import { FAQ } from "../src/models/FAQ";
import { GalleryItem } from "../src/models/GalleryItem";
import { Offer } from "../src/models/Offer";

function withoutId<T extends { _id?: string }>(row: T) {
  const { _id, ...rest } = row;
  void _id;
  return rest;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;
  if (!uri || !dbName) {
    console.error("Set MONGODB_URI and MONGODB_DB_NAME in .env");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName });

  const settingsInsert = withoutId(previewSettings);
  const settingsSyncKeys = new Set([
    "email",
    "startingPriceCents",
    "showPublicPackagePrices",
    "heroImageUrl",
    "logoUrl",
  ]);
  const settingsOnInsertOnly = Object.fromEntries(
    Object.entries(settingsInsert).filter(([key]) => !settingsSyncKeys.has(key))
  );

  await SiteSettings.findOneAndUpdate(
    { singletonKey: "main" },
    {
      $setOnInsert: settingsOnInsertOnly,
      $set: {
        email: previewSettings.email,
        startingPriceCents: previewSettings.startingPriceCents,
        showPublicPackagePrices: previewSettings.showPublicPackagePrices,
        heroImageUrl: previewSettings.heroImageUrl,
        logoUrl: previewSettings.logoUrl,
      },
    },
    { upsert: true, new: true }
  );

  for (const svc of previewServices) {
    await Service.findOneAndUpdate(
      { slug: svc.slug },
      { $setOnInsert: withoutId(svc) },
      { upsert: true }
    );
  }

  for (const pkg of previewPackages) {
    await Package.findOneAndUpdate(
      { slug: pkg.slug },
      { $set: withoutId(pkg) },
      { upsert: true }
    );
  }

  for (const addon of previewAddOns) {
    await AddOn.findOneAndUpdate(
      { slug: addon.slug },
      { $set: withoutId(addon) },
      { upsert: true }
    );
  }

  for (const faq of previewFaqs) {
    await FAQ.findOneAndUpdate(
      { question: faq.question },
      { $setOnInsert: withoutId(faq) },
      { upsert: true }
    );
  }

  await GalleryItem.updateMany(
    {
      $or: [
        { imageUrl: /\/gallery\/events\/rhythm-and-roots\// },
        { imageUrl: /\/gallery\/events\/celebrations\/booth-setup\.jpg/ },
        { imageUrl: /\/gallery\/events\/celebrations\/booth-detail\.jpg/ },
        { imageUrl: "/images/booth-detail.jpg" },
        { imageUrl: "/images/booth-gallery-arch.jpg" },
      ],
    },
    { $set: { status: "archived" } }
  );

  for (const item of previewGallery) {
    await GalleryItem.findOneAndUpdate(
      { imageUrl: item.imageUrl },
      { $set: withoutId(item) },
      { upsert: true }
    );
  }

  await Offer.findOneAndUpdate(
    { slug: previewOffer.slug },
    { $setOnInsert: withoutId(previewOffer) },
    { upsert: true }
  );

  for (const testimonial of previewTestimonials) {
    await Testimonial.findOneAndUpdate(
      { reviewerName: testimonial.reviewerName },
      { $set: withoutId(testimonial) },
      { upsert: true }
    );
  }

  console.log("Seed complete (idempotent — existing records were not overwritten).");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
