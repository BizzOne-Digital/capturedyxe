import { PackageCards } from "@/components/site/PackageCards";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { AddOnCards } from "@/components/site/AddOnCards";
import { getActiveAddOns, getActivePackages, getSiteSettings } from "@/lib/data/public";
import { formatCadWithTaxNote } from "@/lib/money";
import Image from "next/image";
import { siteImages } from "@/lib/site-images";

export const metadata = { title: "Pricing" };

export default async function PricingPage() {
  const settings = await getSiteSettings();
  const packages = await getActivePackages();
  const addOns = await getActiveAddOns();

  return (
    <>
      <section className="relative w-full max-w-full overflow-hidden bg-ink section-y-lg text-porcelain">
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
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">
              Service and pricing
            </p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">Packages</h1>
            <p className="mt-6 text-xl text-porcelain/85">
              Standard, Signature, and Elite — from {formatCadWithTaxNote(settings.startingPriceCents)}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
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
          <Reveal className="mt-20">
            <h2 className="font-display text-3xl md:text-4xl">Optional upgrades</h2>
            <p className="mt-2 max-w-2xl text-sm text-taupe">
              Acrylic magnetic frame upgrade pairs with Standard; keychain station pairs with Signature.
              Elite includes dedication template, magnetic sheets, and a customized guest book in the
              package price.
            </p>
          </Reveal>
          <div className="mt-10">
            <AddOnCards
              addOns={addOns.map((a) => ({
                _id: String(a._id),
                name: a.name,
                description: a.description,
                priceCents: a.priceCents,
                showPricePublicly: a.showPricePublicly,
              }))}
              showPrices={settings.showPublicPackagePrices}
            />
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative min-h-[220px] overflow-hidden rounded-3xl film-frame">
              <Image src={siteImages.acrylicFrames} alt="Acrylic magnetic photo frame upgrade" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
            </div>
            <div className="relative min-h-[220px] overflow-hidden rounded-3xl film-frame">
              <Image src={siteImages.keychainStation} alt="Keychain station keepsakes" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
            </div>
            <div className="relative min-h-[220px] overflow-hidden rounded-3xl film-frame md:col-span-2 lg:col-span-1">
              <Image
                src={siteImages.customGuestBook}
                alt="Customized wooden guest book included with the Elite package"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-taupe">
            Elite package — customized guest book with your names and date.
          </p>
          <div className="mt-10 rounded-3xl bg-sand/40 p-8 text-center">
            <p className="text-sm text-taupe">
              All prices are in CAD and shown before tax. Final quotes are confirmed when you book.
            </p>
            <ButtonLink href="/booking" className="mt-6">Check availability</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
