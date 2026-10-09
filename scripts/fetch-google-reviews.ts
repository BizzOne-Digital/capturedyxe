/**
 * Fetches Google reviews via Places API (New) and writes public/google-reviews-cache.json.
 * Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env
 */
import "dotenv/config";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { execSync } from "child_process";
import { fetchGooglePlaceReviews } from "../src/lib/google-place";

async function main() {
  if (!process.env.GOOGLE_PLACES_API_KEY?.trim()) {
    console.error("Set GOOGLE_PLACES_API_KEY in .env (Places API New enabled in Google Cloud).");
    process.exit(1);
  }

  const data = await fetchGooglePlaceReviews();
  if (!data || data.reviews.length === 0) {
    console.error(
      "No reviews returned. Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env (Places API New enabled)."
    );
    process.exit(1);
  }

  const outPath = join(process.cwd(), "public", "google-reviews-cache.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");
  console.log(
    `Wrote ${data.reviews.length} review(s) · ${data.rating}★ (${data.userRatingCount} total on Google) → ${outPath}`
  );

  if (process.env.MONGODB_URI && process.env.MONGODB_DB_NAME) {
    execSync("tsx scripts/import-google-reviews-cache.ts", { stdio: "inherit" });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
