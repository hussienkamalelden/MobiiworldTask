"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import {
  SORT_OPTIONS,
  buildCatalogHref,
  getCatalogKey,
  isSortOption,
} from "@/lib/catalog";
import type { CatalogParams } from "@/lib/catalog";
import { getTotalAdjustment } from "@/lib/product-changes";
import { useProductChanges } from "@/hooks/use-product-changes";
import type { Category, ProductSummary, ProductsResponse } from "@/types/product";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Notice } from "@/components/ui/notice";
import { SelectField } from "@/components/ui/select-field";
import { ProductList } from "./product-list";
import { SearchField } from "./search-field";

type NoticeType = "category-cleared" | "search-cleared" | "unsupported-combination";

const NOTICE_MESSAGES: Record<NoticeType, string> = {
  "category-cleared":
    "The category filter was removed because the API does not support searching within a category. Showing search results from all categories.",
  "search-cleared":
    "Your search was cleared because the API does not support combining a search with a category filter.",
  "unsupported-combination":
    "The API does not support combining a search with a category filter, so only the search was applied.",
};

interface ProductCatalogProps {
  categories: Category[];
  initialPage: ProductsResponse<ProductSummary>;
  params: CatalogParams;
  hasConflict: boolean;
}

export function ProductCatalog({
  categories,
  initialPage,
  params,
  hasConflict,
}: ProductCatalogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticParams, setOptimisticParams] = useOptimistic(params);
  const [notice, setNotice] = useState<NoticeType | null>(
    hasConflict ? "unsupported-combination" : null,
  );

  const changes = useProductChanges();
  const total = Math.max(0, initialPage.total + getTotalAdjustment(changes, params));
  const hasFilters = params.query !== "" || params.category !== "";
  const activeCategory = categories.find((item) => item.slug === params.category);

  function navigate(updates: Partial<CatalogParams>) {
    const next = { ...optimisticParams, ...updates };
    startTransition(() => {
      setOptimisticParams(next);
      router.replace(buildCatalogHref(next), { scroll: false });
    });
  }

  function handleSearch(query: string) {
    const clearsCategory = query !== "" && optimisticParams.category !== "";
    setNotice(clearsCategory ? "category-cleared" : null);
    navigate({ query, category: clearsCategory ? "" : optimisticParams.category });
  }

  function handleCategoryChange(category: string) {
    const clearsSearch = category !== "" && optimisticParams.query !== "";
    setNotice(clearsSearch ? "search-cleared" : null);
    navigate({ category, query: clearsSearch ? "" : optimisticParams.query });
  }

  function handleSortChange(sort: string) {
    if (isSortOption(sort)) {
      navigate({ sort });
    }
  }

  function handleClearFilters() {
    setNotice(null);
    navigate({ query: "", category: "" });
  }

  function getSummary(): string {
    const count = `${total} ${total === 1 ? "product" : "products"}`;
    if (params.query) return `${count} found for "${params.query}"`;
    if (activeCategory) return `${count} in ${activeCategory.name}`;
    return count;
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchField
          value={optimisticParams.query}
          onSearch={handleSearch}
          className="flex-1"
        />
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <SelectField
            label="Category"
            hideLabel
            value={optimisticParams.category}
            onChange={handleCategoryChange}
            className="sm:w-48"
            options={[
              { value: "", label: "All categories" },
              ...categories.map((item) => ({ value: item.slug, label: item.name })),
            ]}
          />
          <SelectField
            label="Sort by"
            hideLabel
            value={optimisticParams.sort}
            onChange={handleSortChange}
            className="sm:w-48"
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {notice && (
        <div className="mt-4">
          <Notice message={NOTICE_MESSAGES[notice]} onDismiss={() => setNotice(null)} />
        </div>
      )}

      <div className="mt-6 mb-6 flex min-h-9 items-center justify-between gap-3">
        <p aria-live="polite" className="inline-flex items-center gap-2 text-sm text-fg-muted">
          {isPending && <LoaderCircle className="h-4 w-4 animate-spin text-accent-fg" />}
          {isPending ? "Updating results..." : getSummary()}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <div
        aria-busy={isPending}
        className={`transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}
      >
        {total === 0 ? (
          <EmptyState
            title="No products found"
            description={
              hasFilters
                ? "Try a different search term or category."
                : "There are no products in the catalog yet."
            }
            action={
              hasFilters && (
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          <ProductList
            key={getCatalogKey(params)}
            initialPage={initialPage}
            params={params}
            changes={changes}
            total={total}
          />
        )}
      </div>
    </div>
  );
}
