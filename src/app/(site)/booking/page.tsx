import Image from "next/image";
import { BookingForm } from "@/components/forms/BookingForm";
import { Reveal } from "@/components/motion/Reveal";
import { getActiveAddOns, getActivePackages } from "@/lib/data/public";
import { siteImages } from "@/lib/site-images";
import { getStripeBookingConfig } from "@/lib/stripe";

export const metadata = { title: "Booking Request" };

type Props = { searchParams: Promise<{ eventType?: string; cancelled?: string }> };

export default async function BookingPage({ searchParams }: Props) {
  const params = await searchParams;
  const packages = await getActivePackages();
  const addOns = await getActiveAddOns();
  const stripeConfig = getStripeBookingConfig();
  const defaultEventType = params.eventType ?? "";
  const cancelled = params.cancelled === "1";

  return (
    <section className="section-y">
      <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Reveal>
          <h1 className="font-display text-5xl">Check availability</h1>
          <p className="mt-4 text-taupe">
            Complete the steps below to request your date. When you choose a package, you&apos;ll pay the
            package total securely on Stripe after submitting — our team still confirms availability
            and final details with you.
          </p>
          {cancelled && (
            <p className="mt-4 rounded-xl border border-champagne/40 bg-sand/40 px-4 py-3 text-sm text-taupe">
              Payment was cancelled. Your details were not lost if you already submitted — you can try again
              or contact us for help.
            </p>
          )}
          <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-3xl film-frame">
            <Image
              src={siteImages.weddingBanquet}
              alt="Photo booth setup at a formal celebration"
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
        </Reveal>
        <div className="rounded-3xl border border-ink/10 bg-porcelain p-6 md:p-8">
          <BookingForm
            packages={packages.map((p) => ({
              _id: String(p._id),
              name: p.name,
              slug: p.slug,
              priceCents: p.priceCents,
            }))}
            addOns={addOns.map((a) => ({
              _id: String(a._id),
              name: a.name,
              priceCents: a.priceCents,
            }))}
            defaultEventType={defaultEventType}
            stripeConfig={stripeConfig}
          />
        </div>
      </div>
    </section>
  );
}
