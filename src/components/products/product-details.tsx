import { Pencil } from "lucide-react";
import Link from "next/link";
import { BackLink } from "@/components/ui/back-link";
import { buttonStyles } from "@/components/ui/button";
import { formatCategory, formatPrice } from "@/lib/format";
import {
  formatDimensions,
  getAvailabilityTone,
  getOriginalPrice,
  getProductImages,
} from "@/lib/product";
import type { Product } from "@/types/product";
import { AvailabilityBadge } from "./availability-badge";
import { ProductGallery } from "./product-gallery";
import { ProductReviews } from "./product-reviews";
import { Rating } from "./rating";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const originalPrice = getOriginalPrice(product.price, product.discountPercentage);
  const reviewCount = product.reviews.length;

  const specifications = [
    { label: "Brand", value: product.brand },
    { label: "SKU", value: product.sku },
    { label: "In stock", value: `${product.stock} units` },
    { label: "Minimum order", value: `${product.minimumOrderQuantity} units` },
    { label: "Weight", value: String(product.weight) },
    { label: "Dimensions", value: formatDimensions(product.dimensions) },
    { label: "Warranty", value: product.warrantyInformation },
    { label: "Shipping", value: product.shippingInformation },
    { label: "Return policy", value: product.returnPolicy },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <article>
      <div className="flex items-center justify-between gap-4">
        <BackLink href="/products" label="Back to products" />
        <Link
          href={`/products/${product.id}/edit`}
          className={buttonStyles({ variant: "secondary", size: "sm" })}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={getProductImages(product)} title={product.title} />

        <div className="flex flex-col">
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="self-start rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-soft-fg transition-opacity hover:opacity-80"
          >
            {formatCategory(product.category)}
          </Link>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {product.title}
          </h1>

          {product.brand && (
            <p className="mt-2 text-sm text-fg-muted">
              by <span className="font-medium text-fg">{product.brand}</span>
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Rating value={product.rating} />
            <a
              href="#reviews-heading"
              className="rounded text-sm text-fg-subtle underline-offset-4 hover:text-fg hover:underline"
            >
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <p className="text-3xl font-semibold text-fg">
              <span className="sr-only">Price: </span>
              {formatPrice(product.price)}
            </p>
            {originalPrice !== null && (
              <>
                <p className="text-lg text-fg-subtle line-through">
                  <span className="sr-only">Original price: </span>
                  {formatPrice(originalPrice)}
                </p>
                <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success-fg">
                  Save {Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          <div className="mt-4">
            <AvailabilityBadge
              label={product.availabilityStatus}
              tone={getAvailabilityTone(product)}
            />
          </div>

          <p className="mt-6 leading-relaxed text-fg-muted">{product.description}</p>

          {product.tags.length > 0 && (
            <ul aria-label="Tags" className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-3 py-1 text-xs text-fg-muted"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          )}

          <section aria-labelledby="specifications-heading" className="mt-8">
            <h2
              id="specifications-heading"
              className="text-sm font-semibold tracking-wide text-fg uppercase"
            >
              Specifications
            </h2>
            <dl className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
              {specifications.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4 px-4 py-3 text-sm"
                >
                  <dt className="text-fg-subtle">{item.label}</dt>
                  <dd className="text-right font-medium text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <ProductReviews reviews={product.reviews} />
    </article>
  );
}
