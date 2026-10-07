import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { PreviewBanner } from "@/components/site/PreviewBanner";
import { getPublicSocialLinks, getSiteSettings } from "@/lib/data/public";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const social = getPublicSocialLinks(settings);

  return (
    <>
      <PreviewBanner />
      <Header logoUrl={settings.logoUrl} siteName={settings.siteName} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer
        logoUrl={settings.logoUrl}
        siteName={settings.siteName}
        tagline={settings.tagline}
        email={settings.email}
        phone={settings.phone}
        phoneTel={settings.phoneTel}
        serviceArea={settings.serviceArea}
        instagram={social.instagram}
        facebook={social.facebook}
      />
    </>
  );
}
