import "dotenv/config";
import mongoose from "mongoose";
import { galleryImages, siteImages } from "../src/lib/site-images";
import { Service } from "../src/models/Service";
import { GalleryItem } from "../src/models/GalleryItem";
import { SiteSettings } from "../src/models/SiteSettings";

const serviceUpdates: Array<{ slug: string; imageUrl: string; imageAlt: string }> = [
  { slug: "weddings", imageUrl: siteImages.weddingBanquet, imageAlt: "Wooden photo booth at an elegant wedding reception" },
  { slug: "corporate-events", imageUrl: siteImages.corporateGala, imageAlt: "Photo booth at a corporate gala" },
  { slug: "milestone-celebrations", imageUrl: siteImages.weddingBalloons, imageAlt: "Celebration photo booth with balloon arch" },
  { slug: "product-launches", imageUrl: siteImages.corporateGala, imageAlt: "Launch event photo booth setup" },
  { slug: "school-events", imageUrl: siteImages.schoolGraduation, imageAlt: "Graduation photo booth setup" },
  { slug: "public-festivals", imageUrl: siteImages.outdoorGazebo, imageAlt: "Outdoor festival photo booth" },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;
  if (!uri || !dbName) {
    console.error("Set MONGODB_URI and MONGODB_DB_NAME");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName });

  for (const row of serviceUpdates) {
    await Service.updateOne(
      { slug: row.slug },
      { $set: { imageUrl: row.imageUrl, imageAlt: row.imageAlt } }
    );
  }

  await SiteSettings.updateOne(
    { singletonKey: "main" },
    { $set: { heroImageUrl: siteImages.hero } }
  );

  await GalleryItem.deleteMany({ designation: "inspiration" });
  await GalleryItem.insertMany(
    galleryImages.map((item, order) => ({
      imageUrl: item.imageUrl,
      alt: item.alt,
      caption: item.caption,
      category: item.category,
      designation: "inspiration",
      order,
      status: "published",
    }))
  );

  console.log("Brand images synced to services, gallery, and site settings.");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
