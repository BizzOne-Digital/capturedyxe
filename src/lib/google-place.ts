/** Captured.yxe listing (1251 Hargreaves Way, Saskatoon). */
export const DEFAULT_GOOGLE_PLACE_ID = "IWfJaqGJLNiahvcP6duTsAg";

/** Public link when Places API is not configured. */
export function getGoogleReviewsPageUrl(): string {
  return (
    process.env.GOOGLE_REVIEWS_URL?.trim() ||
    "https://www.google.com/maps/place/Captured.yxe/@52.1434,-106.6472,17z/data=!4m6!3m5!1sIWfJaqGJLNiahvcP6duTsAg!8m2!3d52.1434!4d-106.6472!16s%2Fg%2F11v0wxv5xq"
  );
}

export type GooglePlaceReview = {
  author: string;
  rating: number;
  text: string;
  publishTime: string;
  profileUrl?: string;
};

export type GooglePlaceReviewsData = {
  displayName: string;
  rating: number;
  userRatingCount: number;
  googleMapsUri: string;
  writeReviewUri: string;
  reviews: GooglePlaceReview[];
};

type PlacesApiReview = {
  authorAttribution?: { displayName?: string; uri?: string };
  rating?: number;
  text?: { text?: string };
  publishTime?: string;
  googleMapsUri?: string;
};

async function loadCachedGoogleReviews(): Promise<GooglePlaceReviewsData | null> {
  try {
    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const raw = await readFile(join(process.cwd(), "public", "google-reviews-cache.json"), "utf8");
    const data = JSON.parse(raw) as GooglePlaceReviewsData;
    if (!data.reviews?.length) return null;
    return data;
  } catch {
    return null;
  }
}

export async function fetchGooglePlaceReviews(): Promise<GooglePlaceReviewsData | null> {
  const placeId = process.env.GOOGLE_PLACE_ID?.trim() || DEFAULT_GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) return loadCachedGoogleReviews();

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Google Places API error:", res.status, await res.text());
      return loadCachedGoogleReviews();
    }

    const data = (await res.json()) as {
      displayName?: { text?: string };
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: PlacesApiReview[];
    };

    const mapsUri = data.googleMapsUri ?? getGoogleReviewsPageUrl();
    const reviews = (data.reviews ?? [])
      .filter((r) => r.text?.text?.trim())
      .map((r) => ({
        author: r.authorAttribution?.displayName?.trim() || "Google reviewer",
        rating: r.rating ?? 5,
        text: r.text!.text!.trim(),
        publishTime: r.publishTime ?? "",
        profileUrl: r.authorAttribution?.uri,
      }));

    return {
      displayName: data.displayName?.text ?? "Captured.yxe",
      rating: data.rating ?? 0,
      userRatingCount: data.userRatingCount ?? 0,
      googleMapsUri: mapsUri,
      writeReviewUri: mapsUri,
      reviews,
    };
  } catch (err) {
    console.error("fetchGooglePlaceReviews failed:", err);
    return loadCachedGoogleReviews();
  }
}
