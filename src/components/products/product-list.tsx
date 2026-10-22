"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";
import { PAGE_SIZE } from "@/lib/catalog";
import type { CatalogParams } from "@/lib/catalog";
import { applyChangesToList } from "@/lib/product-changes";
import type { ProductChanges } from "@/lib/product-changes";
import type { ProductSummary, ProductsResponse } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "./product-grid";

const PLACEHOLDER_COUNT = 4;
const AUTO_LOAD_PAGES = 4;

interface ProductListProps {
  initialPage: ProductsResponse<ProductSummary>;
  params: CatalogParams;
  changes: ProductChanges;
  total: number;
}

export function ProductList({ initialPage, params, changes, total }: ProductListProps) {
  const { products, hasMore, status, loadMore } = useInfiniteProducts(initialPage, params);
  const visibleProducts = useMemo(
    () => applyChangesToList(products, changes, params),
    [products, changes, params],
  );
  const initialIds = useMemo(
    () => new Set(initialPage.products.map((product) => product.id)),
    [initialPage],
  );
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadedPages = Math.ceil((products.length - initialPage.products.length) / PAGE_SIZE);
  const canAutoLoad = loadedPages < AUTO_LOAD_PAGES;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || status !== "idle" || !canAutoLoad) return;

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
  }, [hasMore, status, canAutoLoad, loadMore]);

  return (
    <>
      <ProductGrid
        products={visibleProducts}
        initialIds={initialIds}
        placeholderCount={status === "loading" ? PLACEHOLDER_COUNT : 0}
      />
      <div ref={sentinelRef} aria-hidden="true" />
      <div aria-live="polite" className="mt-12 flex justify-center text-sm text-fg-subtle">
        {status === "loading" && (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin text-accent-fg" />
            Loading more products...
          </span>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-fg-muted">We could not load more products.</p>
            <Button variant="secondary" size="sm" onClick={() => void loadMore()}>
              Try again
            </Button>
          </div>
        )}
        {status === "idle" && hasMore && !canAutoLoad && (
          <Button variant="secondary" onClick={() => void loadMore()}>
            Load more products
          </Button>
        )}
        {!hasMore && visibleProducts.length > 0 && (
          <p>You have seen all {total} products</p>
        )}
      </div>
    </>
  );
}
