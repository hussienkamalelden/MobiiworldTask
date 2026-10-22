"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toProductListQuery } from "@/lib/catalog";
import type { CatalogParams } from "@/lib/catalog";
import { getProducts } from "@/services/product-service";
import type { ProductSummary, ProductsResponse } from "@/types/product";

export type LoadMoreStatus = "idle" | "loading" | "error";

function appendUnique(
  current: ProductSummary[],
  incoming: ProductSummary[],
): ProductSummary[] {
  const existingIds = new Set(current.map((product) => product.id));
  return [
    ...current,
    ...incoming.filter((product) => !existingIds.has(product.id)),
  ];
}

export function useInfiniteProducts(
  initialPage: ProductsResponse<ProductSummary>,
  params: CatalogParams,
) {
  const [products, setProducts] = useState(initialPage.products);
  const [total, setTotal] = useState(initialPage.total);
  const [status, setStatus] = useState<LoadMoreStatus>("idle");
  const controllerRef = useRef<AbortController | null>(null);

  const hasMore = products.length < total;

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const loadMore = useCallback(async () => {
    if (controllerRef.current || !hasMore) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus("loading");

    try {
      const page = await getProducts(
        toProductListQuery(params, products.length),
        controller.signal,
      );
      setProducts((current) => appendUnique(current, page.products));
      setTotal(page.products.length === 0 ? products.length : page.total);
      setStatus("idle");
    } catch {
      if (!controller.signal.aborted) {
        setStatus("error");
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }, [hasMore, params, products.length]);

  return { products, total, hasMore, status, loadMore };
}
