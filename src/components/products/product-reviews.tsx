import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { ProductReview } from "@/types/product";
import { Rating } from "./rating";

interface ProductReviewsProps {
  reviews: ProductReview[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  return (
    <section aria-labelledby="reviews-heading" className="mt-16">
      <h2
        id="reviews-heading"
        className="text-xl font-semibold tracking-tight text-fg sm:text-2xl"
      >
        Customer reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
          <MessageSquare className="h-4 w-4" />
          No reviews yet.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li
              key={`${review.reviewerEmail}-${review.date}-${review.comment}`}
              className="flex flex-col rounded-2xl border border-line bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-fg">{review.reviewerName}</p>
                  <time dateTime={review.date} className="text-xs text-fg-subtle">
                    {formatDate(review.date)}
                  </time>
                </div>
                <Rating value={review.rating} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
