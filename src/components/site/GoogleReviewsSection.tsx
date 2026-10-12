import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { GooglePlaceReviewsData } from "@/lib/google-place";
import { getGoogleReviewsPageUrl } from "@/lib/google-place";
import { StarRating } from "@/components/site/StarRating";
import { Reveal } from "@/components/motion/Reveal";

function formatReviewDate(iso: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-CA", { month: "short", year: "numeric" }).format(
      new Date(iso)
    );
  } catch {
    return "";
  }
}

export function GoogleReviewsSection({ data }: { data: GooglePlaceReviewsData | null }) {
  const fallbackUrl = getGoogleReviewsPageUrl();
  const mapsUrl = data?.googleMapsUri ?? fallbackUrl;
  const rating = data?.rating ?? 0;
  const count = data?.userRatingCount ?? 0;
  const reviews = data?.reviews ?? [];

  return (
    <section className="border-b border-ink/10 bg-porcelain py-10 md:py-14">
      <div className="mx-auto w-full min-w-0 max-w-4xl px-4 md:px-8">
        <Reveal>
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">
                Google reviews
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
                What guests say on Google
              </h2>
              {rating > 0 && (
                <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                  <StarRating rating={rating} />
                  <p className="text-sm text-taupe">
                    <span className="font-medium text-ink">{rating.toFixed(1)}</span>
                    {count > 0 && (
                      <>
                        {" "}
                        · {count} review{count === 1 ? "" : "s"}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-sm border border-ink/15 bg-ivory px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-champagne hover:bg-sand/40 sm:mt-0"
            >
              Read all on Google
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </Reveal>

        {reviews.length > 0 ? (
          <ul className="mt-10 space-y-6">
            {reviews.map((review, i) => (
              <Reveal key={`${review.author}-${review.publishTime}-${i}`} delay={i * 0.04}>
                <li className="rounded-2xl border border-ink/10 bg-ivory p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <StarRating rating={review.rating} />
                    {review.publishTime && (
                      <time
                        className="text-xs text-taupe"
                        dateTime={review.publishTime}
                      >
                        {formatReviewDate(review.publishTime)}
                      </time>
                    )}
                  </div>
                  <p className="mt-4 font-display text-xl leading-snug text-ink md:text-2xl">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <footer className="mt-4 text-sm text-taupe">— {review.author}</footer>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-champagne/80">
                    Posted on Google
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-champagne/40 bg-ivory p-8 text-center">
            <p className="text-sm text-taupe">
              Google reviews load automatically once a Places API key is configured, or after running{" "}
              <code className="text-ink">npm run fetch-google-reviews</code>. You can always read the
              latest on Google using the button above.
            </p>
            <Link
              href="/testimonials"
              className="mt-4 inline-block text-sm text-ink underline underline-offset-4"
            >
              See featured testimonials below
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
