import { Star } from "lucide-react";
import { formatRating } from "@/lib/format";

interface RatingProps {
  value: number;
}

export function Rating({ value }: RatingProps) {
  const rating = formatRating(Math.min(Math.max(value, 0), 5));

  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-stone-700">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      <span aria-hidden="true">{rating}</span>
      <span className="sr-only">Rated {rating} out of 5</span>
    </span>
  );
}
