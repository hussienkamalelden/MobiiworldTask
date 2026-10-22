"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";
import type { CatalogParams } from "@/lib/catalog";
import type { ProductSummary, ProductsResponse } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "./product-grid";

const PLACEHOLDER_COUNT = 4;

interface ProductListProps {
  initialPage: ProductsResponse<ProductSummary>;
  params: CatalogParams;
}

export function ProductList({ initialPage, params }: ProductListProps) {
  const { products, total, hasMore, status, loadMore } = useInfiniteProducts(
    initialPage,
    params,
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || status !== "idle") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, status, loadMore]);

  return (
    <>
      <ProductGrid
        products={products}
        placeholderCount={status === "loading" ? PLACEHOLDER_COUNT : 0}
      />
      <div ref={sentinelRef} aria-hidden="true" />
      <div aria-live="polite" className="mt-12 flex justify-center text-sm text-stone-500">
        {status === "loading" && (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin text-brand-700" />
            Loading more products...
          </span>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-stone-700">We could not load more products.</p>
            <Button variant="secondary" size="sm" onClick={() => void loadMore()}>
              Try again
            </Button>
          </div>
        )}
        {!hasMore && products.length > 0 && (
          <p>You have seen all {total} products</p>
        )}
      </div>
    </>
  );
}
