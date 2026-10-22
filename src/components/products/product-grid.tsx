import type { ProductSummary } from "@/types/product";
import { ProductCardSkeleton } from "./catalog-skeleton";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: ProductSummary[];
  placeholderCount?: number;
}

export function ProductGrid({ products, placeholderCount = 0 }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id} className="animate-fade-in">
          <ProductCard product={product} priority={index < 4} />
        </li>
      ))}
      {Array.from({ length: placeholderCount }, (_, index) => (
        <li key={`placeholder-${index}`}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
