import type { GooglePlaceReviewsData } from "@/lib/google-place";
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
  const rating = data?.rating ?? 0;
  const count = data?.userRatingCount ?? 0;
  const reviews = data?.reviews ?? [];

  return (
    <section className="border-b border-ink/10 bg-porcelain py-10 md:py-14">
      <div className="mx-auto w-full min-w-0 max-w-4xl px-4 md:px-8">
        <Reveal>
          <div className="text-center sm:text-left">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-champagne">
              Google reviews
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              What guests say
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
        </Reveal>

        {reviews.length > 0 ? (
          <ul className="mt-10 space-y-6">
            {reviews.map((review, i) => (
              <Reveal key={`${review.author}-${review.publishTime}-${i}`} delay={i * 0.04}>
                <li className="rounded-2xl border border-ink/10 bg-ivory p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <StarRating rating={review.rating} />
                    {review.publishTime && (
                      <time className="text-xs text-taupe" dateTime={review.publishTime}>
                        {formatReviewDate(review.publishTime)}
                      </time>
                    )}
                  </div>
                  <p className="mt-4 whitespace-pre-line font-display text-xl leading-snug text-ink md:text-2xl">
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
            <p className="text-sm text-taupe">Reviews will appear here shortly.</p>
          </div>
        )}
      </div>
    </section>
  );
}
