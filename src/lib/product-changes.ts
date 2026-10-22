import { SORT_OPTIONS } from "./catalog";
import type { CatalogParams, SortOption } from "./catalog";
import { toProductSummary } from "./product";
import type { Product, ProductSummary } from "@/types/product";

export type DeletedProductSnapshot = Pick<Product, "id" | "title" | "category" | "description">;

export interface ProductChanges {
  created: Product[];
  updated: Record<string, Product>;
  deleted: Record<string, DeletedProductSnapshot>;
}

export const EMPTY_PRODUCT_CHANGES: ProductChanges = {
  created: [],
  updated: {},
  deleted: {},
};

export type ResolvedProduct =
  | { status: "available"; product: Product; isLocal: boolean }
  | { status: "deleted" }
  | { status: "missing" };

export function resolveProduct(
  id: number,
  apiProduct: Product | null,
  changes: ProductChanges,
): ResolvedProduct {
  if (changes.deleted[id]) return { status: "deleted" };

  const created = changes.created.find((product) => product.id === id);
  if (created) return { status: "available", product: created, isLocal: true };

  const updated = changes.updated[id];
  if (updated) return { status: "available", product: updated, isLocal: true };

  if (apiProduct) return { status: "available", product: apiProduct, isLocal: false };
  return { status: "missing" };
}

export function matchesCatalog(
  product: Pick<Product, "title" | "category" | "description">,
  { query, category }: Pick<CatalogParams, "query" | "category">,
): boolean {
  if (query) {
    const normalizedQuery = query.toLowerCase();
    return (
      product.title.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery)
    );
  }
  if (category) return product.category === category;
  return true;
}

function sortProducts(products: ProductSummary[], sort: SortOption): ProductSummary[] {
  const definition = SORT_OPTIONS.find((option) => option.value === sort);
  const sortBy = definition?.sortBy;
  if (!sortBy) return products;

  const direction = definition.order === "desc" ? -1 : 1;
  return [...products].sort((a, b) => (a[sortBy] - b[sortBy]) * direction);
}

export function applyChangesToList(
  products: ProductSummary[],
  changes: ProductChanges,
  params: CatalogParams,
): ProductSummary[] {
  const created = sortProducts(
    changes.created.filter((product) => matchesCatalog(product, params)).map(toProductSummary),
    params.sort,
  );

  const existing = products
    .filter((product) => !changes.deleted[product.id])
    .map((product) => {
      const updated = changes.updated[product.id];
      return updated ? toProductSummary(updated) : product;
    });

  return [...created, ...existing];
}

export function getTotalAdjustment(changes: ProductChanges, params: CatalogParams): number {
  const created = changes.created.filter((product) => matchesCatalog(product, params)).length;
  const deleted = Object.values(changes.deleted).filter((product) =>
    matchesCatalog(product, params),
  ).length;
  return created - deleted;
}

export function countProductChanges(changes: ProductChanges): number {
  return (
    changes.created.length +
    Object.keys(changes.updated).length +
    Object.keys(changes.deleted).length
  );
}
