import { NextResponse } from "next/server";
import { fetchGooglePlaceReviews, getGoogleReviewsPageUrl } from "@/lib/google-place";

export async function GET() {
  const data = await fetchGooglePlaceReviews();
  return NextResponse.json({
    data,
    fallbackUrl: getGoogleReviewsPageUrl(),
  });
}
