/** Captured.yxe listing (1251 Hargreaves Way, Saskatoon). */
export const DEFAULT_GOOGLE_PLACE_ID = "IWfJaqGJLNiahvcP6duTsAg";

const BUSINESS_QUERY = "Captured.yxe";

/**
 * Opens Google Maps on this business (reviews visible on the place profile).
 * Note: search.google.com/local/reviews?placeid=… returns 404 — do not use.
 */
export function getGoogleReviewsPageUrl(): string {
  if (process.env.GOOGLE_REVIEWS_URL?.trim()) {
    return process.env.GOOGLE_REVIEWS_URL.trim();
  }
  const placeId = process.env.GOOGLE_PLACE_ID?.trim() || DEFAULT_GOOGLE_PLACE_ID;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_QUERY)}&query_place_id=${encodeURIComponent(placeId)}`;
}

/** Business profile on Maps (directions / address). */
export function getGoogleMapsPlaceUrl(): string {
  return "https://www.google.com/maps/place/Captured.yxe/@52.1434,-106.6472,17z/data=!4m6!3m5!1sIWfJaqGJLNiahvcP6duTsAg!8m2!3d52.1434!4d-106.6472!16s%2Fg%2F11v0wxv5xq";
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
    const reviewsUrl = getGoogleReviewsPageUrl();
    return {
      ...data,
      googleMapsUri: data.googleMapsUri?.includes("google.com/maps") ? data.googleMapsUri : reviewsUrl,
      writeReviewUri: data.writeReviewUri || getGoogleMapsPlaceUrl(),
    };
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
        "X-Goog-FieldMask":
          "displayName,rating,userRatingCount,googleMapsUri,googleMapsLinks,reviews",
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
      googleMapsLinks?: {
        reviewsUri?: string;
        placeUri?: string;
        writeAReviewUri?: string;
      };
      reviews?: PlacesApiReview[];
    };

    const mapsUri = data.googleMapsUri ?? getGoogleMapsPlaceUrl();
    const reviewsUrl =
      data.googleMapsLinks?.reviewsUri?.trim() ||
      data.googleMapsLinks?.placeUri?.trim() ||
      getGoogleReviewsPageUrl();
    const writeReviewUri =
      data.googleMapsLinks?.writeAReviewUri?.trim() || mapsUri;

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
      googleMapsUri: reviewsUrl,
      writeReviewUri,
      reviews,
    };
  } catch (err) {
    console.error("fetchGooglePlaceReviews failed:", err);
    return loadCachedGoogleReviews();
  }
}
