import { Star } from "lucide-react";

export function StarRating({
  rating,
  max = 5,
  className = "",
}: {
  rating: number;
  max?: number;
  className?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = rounded >= i + 1;
        const half = !filled && rounded >= i + 0.5;
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${
              filled
                ? "fill-champagne text-champagne"
                : half
                  ? "fill-champagne/50 text-champagne"
                  : "fill-transparent text-champagne/35"
            }`}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
