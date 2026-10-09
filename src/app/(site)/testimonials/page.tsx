import { Reveal } from "@/components/motion/Reveal";
import { GoogleReviewsSection } from "@/components/site/GoogleReviewsSection";
import { TestimonialsClient } from "@/components/site/TestimonialsClient";
import { getPublishedTestimonials } from "@/lib/data/public";
import { fetchGooglePlaceReviews } from "@/lib/google-place";

export const metadata = {
  title: "Testimonials",
  description:
    "Google reviews and client testimonials for Captured.yxe photo booth rentals in Saskatoon.",
};

export default async function TestimonialsPage() {
  const [google, items] = await Promise.all([
    fetchGooglePlaceReviews(),
    getPublishedTestimonials(),
  ]);

  return (
    <>
      <section className="border-b border-ink/8 bg-ivory py-14 md:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <Reveal>
            <h1 className="font-display text-5xl">Testimonials</h1>
            <p className="mt-4 text-taupe">
              Real feedback from Google and celebrations we are proud to support.
            </p>
          </Reveal>
        </div>
      </section>

      <GoogleReviewsSection data={google} />
      <TestimonialsClient initialItems={items} />
    </>
  );
}
