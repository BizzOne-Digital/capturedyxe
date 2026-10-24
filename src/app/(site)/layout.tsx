import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { PreviewBanner } from "@/components/site/PreviewBanner";
import { StructuredData } from "@/components/site/StructuredData";
import { getPublicSocialLinks, getPublishedServices, getSiteSettings } from "@/lib/data/public";
import { buildExperienceNavLinks } from "@/lib/experience-nav";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const social = getPublicSocialLinks(settings);
  const services = await getPublishedServices();
  const experienceLinks = buildExperienceNavLinks(services);

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-clip">
      <StructuredData />
      <PreviewBanner />
      <Header siteName={settings.siteName} experienceLinks={experienceLinks} />
      <main className="relative w-full min-w-0 flex-1 overflow-x-clip">{children}</main>
      <Footer
        siteName={settings.siteName}
        email={settings.email}
        phone={settings.phone}
        phoneTel={settings.phoneTel}
        serviceArea={settings.serviceArea}
        instagram={social.instagram}
        facebook={social.facebook}
      />
    </div>
  );
}
