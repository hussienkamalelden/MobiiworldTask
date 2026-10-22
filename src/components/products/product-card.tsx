import Link from "next/link";
import { formatCategory, formatPrice } from "@/lib/format";
import type { ProductSummary } from "@/types/product";
import { ProductImage } from "./product-image";
import { Rating } from "./rating";

interface ProductCardProps {
  product: ProductSummary;
  eager?: boolean;
}

export function ProductCard({ product, eager = false }: ProductCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-focus has-[a:focus-visible]:ring-offset-4 has-[a:focus-visible]:ring-offset-canvas">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-media transition-colors duration-300 group-hover:border-accent-line">
        <ProductImage
          src={product.thumbnail}
          alt={product.title}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          eager={eager}
          className="p-6 transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex flex-1 flex-col px-1">
        <p className="text-xs font-medium tracking-wide text-accent-fg uppercase">
          {formatCategory(product.category)}
        </p>
        <h2 className="mt-1 line-clamp-1 text-sm font-medium text-fg transition-colors group-hover:text-accent-fg">
          <Link
            href={`/products/${product.id}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {product.title}
          </Link>
        </h2>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-base font-semibold text-fg">
            {formatPrice(product.price)}
          </p>
          <Rating value={product.rating} />
        </div>
      </div>
    </article>
  );
}
