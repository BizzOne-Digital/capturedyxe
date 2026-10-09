import { getSiteSettings } from "@/lib/data/public";
import { fetchGooglePlaceReviews, getGoogleReviewsPageUrl } from "@/lib/google-place";
import { getSiteUrl } from "@/lib/site-url";

export async function StructuredData() {
  const settings = await getSiteSettings();
  const google = await fetchGooglePlaceReviews();
  const url = getSiteUrl();

  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.siteName,
    description: settings.defaultSeoDescription,
    url,
    email: settings.email,
    telephone: settings.phone,
    sameAs: [getGoogleReviewsPageUrl()],
    areaServed: {
      "@type": "City",
      name: "Saskatoon",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Saskatoon",
      addressRegion: "SK",
      addressCountry: "CA",
    },
  };

  if (google && google.rating > 0 && google.userRatingCount > 0) {
    organization.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: google.rating,
      reviewCount: google.userRatingCount,
      bestRating: 5,
    };
  }

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Photo Booth Rental",
    provider: { "@type": "LocalBusiness", name: settings.siteName },
    areaServed: "Saskatoon, Saskatchewan",
    description: settings.subheadline,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
    </>
  );
}
