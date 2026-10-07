import { PackageCards } from "@/components/site/PackageCards";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getActivePackages, getSiteSettings } from "@/lib/data/public";
import { formatCadWithTaxNote } from "@/lib/money";
import Image from "next/image";
import { siteImages } from "@/lib/site-images";

export const metadata = { title: "Pricing" };

export default async function PricingPage() {
  const settings = await getSiteSettings();
  const packages = await getActivePackages();

  return (
    <>
      <section className="relative w-full max-w-full overflow-hidden bg-ink py-16 text-porcelain md:py-24">
        <Image
          src={siteImages.boothDetail}
          alt=""
          fill
          className="object-cover opacity-40"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-ink/70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 text-center md:px-8">
          <Reveal>
            <h1 className="font-display text-5xl md:text-6xl">Pricing</h1>
            <p className="mt-6 text-xl text-porcelain/85">
              Photo booth experiences starting from {formatCadWithTaxNote(settings.startingPriceCents)}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full min-w-0 max-w-7xl px-4 md:px-8">
          <Reveal>
            <p className="max-w-2xl text-taupe">
              Standard, Signature, and Elite packages are designed for different celebration sizes and
              timelines. Your final quote depends on the package you select and any requested extras — we will
              confirm everything with you directly.
            </p>
          </Reveal>
          <div className="mt-12">
            <PackageCards
              packages={packages}
              showPrices={settings.showPublicPackagePrices}
            />
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="relative min-h-[220px] overflow-hidden rounded-3xl film-frame">
              <Image src={siteImages.acrylicFrames} alt="Acrylic magnetic photo frame upgrade" fill className="object-cover" />
            </div>
            <div className="relative min-h-[220px] overflow-hidden rounded-3xl film-frame">
              <Image src={siteImages.keychainStation} alt="Keychain station keepsakes" fill className="object-cover" />
            </div>
          </div>
          <div className="mt-10 rounded-3xl bg-sand/40 p-8 text-center">
            <p className="text-taupe text-sm">
              Optional add-ons such as acrylic magnetic frame upgrades and keychain stations may be available.
              Eligibility, quantities, and pricing units are confirmed on enquiry.
            </p>
            <ButtonLink href="/booking" className="mt-6">Request a Quote</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
