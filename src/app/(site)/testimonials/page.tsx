import { Reveal } from "@/components/motion/Reveal";
import { GoogleReviewsSection } from "@/components/site/GoogleReviewsSection";
import { fetchGooglePlaceReviews } from "@/lib/google-place";

export const metadata = {
  title: "Testimonials",
  description: "Google reviews from Captured.YXE photo booth guests in Saskatoon.",
};

export default async function TestimonialsPage() {
  const google = await fetchGooglePlaceReviews();

  return (
    <>
      <section className="border-b border-ink/8 bg-ivory py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <Reveal>
            <h1 className="font-display text-5xl">Testimonials</h1>
            <p className="mt-4 text-taupe">
              Kind words from guests — shared on Google.
            </p>
          </Reveal>
        </div>
      </section>

      <GoogleReviewsSection data={google} />
    </>
  );
}
