import { getSiteSettings } from "@/lib/data/public";
import { getSiteUrl } from "@/lib/site-url";

export async function StructuredData() {
  const settings = await getSiteSettings();
  const url = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.siteName,
    description: settings.defaultSeoDescription,
    url,
    email: settings.email,
    telephone: settings.phone,
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
