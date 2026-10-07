import Image from "next/image";
import { BookingForm } from "@/components/forms/BookingForm";
import { Reveal } from "@/components/motion/Reveal";
import { getActiveAddOns, getActivePackages } from "@/lib/data/public";
import { siteImages } from "@/lib/site-images";

export const metadata = { title: "Booking Request" };

type Props = { searchParams: Promise<{ eventType?: string }> };

export default async function BookingPage({ searchParams }: Props) {
  const params = await searchParams;
  const packages = await getActivePackages();
  const addOns = await getActiveAddOns();
  const defaultEventType = params.eventType ?? "";

  return (
    <section className="py-20">
      <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Reveal>
          <h1 className="font-display text-5xl">Check availability</h1>
          <p className="mt-4 text-taupe">
            Complete the steps below to request your date. This form does not reserve your event or collect
            payment — our team will contact you to confirm availability and details.
          </p>
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
            packages={packages.map((p) => ({ _id: String(p._id), name: p.name, slug: p.slug }))}
            addOns={addOns.map((a) => ({ _id: String(a._id), name: a.name }))}
            defaultEventType={defaultEventType}
          />
        </div>
      </div>
    </section>
  );
}
