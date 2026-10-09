/**
 * Upserts reviews from public/google-reviews-cache.json into MongoDB testimonials.
 */
import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import mongoose from "mongoose";
import type { GooglePlaceReviewsData } from "../src/lib/google-place";
import { Testimonial } from "../src/models/Testimonial";

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;
  if (!uri || !dbName) {
    console.error("Set MONGODB_URI and MONGODB_DB_NAME in .env");
    process.exit(1);
  }

  const path = join(process.cwd(), "public", "google-reviews-cache.json");
  let data: GooglePlaceReviewsData;
  try {
    data = JSON.parse(readFileSync(path, "utf8")) as GooglePlaceReviewsData;
  } catch {
    console.error(`Missing or invalid ${path}. Run npm run fetch-google-reviews first.`);
    process.exit(1);
  }

  if (!data.reviews?.length) {
    console.error("Cache has no reviews.");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName });

  let order = 0;
  for (const review of data.reviews) {
    await Testimonial.findOneAndUpdate(
      { reviewerName: review.author, quote: review.text },
      {
        $set: {
          reviewerName: review.author,
          quote: review.text,
          rating: review.rating,
          eventCategory: "general",
          order,
          status: "published",
        },
      },
      { upsert: true }
    );
    order += 1;
  }

  console.log(`Imported ${data.reviews.length} Google review(s) into testimonials.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
