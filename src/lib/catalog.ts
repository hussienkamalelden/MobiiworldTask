import type {
  ProductListQuery,
  SortField,
  SortOrder,
} from "@/types/product";

export const PAGE_SIZE = 12;

const PRODUCTS_PATH = "/products";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "rating-asc";

interface SortDefinition {
  value: SortOption;
  label: string;
  sortBy?: SortField;
  order?: SortOrder;
}

export const SORT_OPTIONS: ReadonlyArray<SortDefinition> = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High", sortBy: "price", order: "asc" },
  { value: "price-desc", label: "Price: High to Low", sortBy: "price", order: "desc" },
  { value: "rating-desc", label: "Top Rated", sortBy: "rating", order: "desc" },
  { value: "rating-asc", label: "Lowest Rated", sortBy: "rating", order: "asc" },
];

const DEFAULT_SORT: SortOption = "featured";

export interface CatalogParams {
  query: string;
  category: string;
  sort: SortOption;
}

export interface ParsedCatalogParams {
  params: CatalogParams;
  hasConflict: boolean;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function readParam(searchParams: RawSearchParams, key: string): string {
  const value = searchParams[key];
  const first = Array.isArray(value) ? value[0] : value;
  return first?.trim() ?? "";
}

export function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function parseCatalogParams(
  searchParams: RawSearchParams,
  categorySlugs: ReadonlyArray<string>,
): ParsedCatalogParams {
  const query = readParam(searchParams, "q");
  const rawCategory = readParam(searchParams, "category");
  const rawSort = readParam(searchParams, "sort");
  const category = categorySlugs.includes(rawCategory) ? rawCategory : "";
  const hasConflict = query !== "" && category !== "";

  return {
    params: {
      query,
      category: hasConflict ? "" : category,
      sort: isSortOption(rawSort) ? rawSort : DEFAULT_SORT,
    },
    hasConflict,
  };
}

export function toProductListQuery(
  { query, category, sort }: CatalogParams,
  skip: number,
): ProductListQuery {
  const sortDefinition = SORT_OPTIONS.find((option) => option.value === sort);

  return {
    filter: query
      ? { type: "search", query }
      : category
        ? { type: "category", slug: category }
        : undefined,
    sortBy: sortDefinition?.sortBy,
    order: sortDefinition?.order,
    limit: PAGE_SIZE,
    skip,
  };
}

export function buildCatalogHref({ query, category, sort }: CatalogParams): string {
  const searchParams = new URLSearchParams();
  if (query) searchParams.set("q", query);
  if (category) searchParams.set("category", category);
  if (sort !== DEFAULT_SORT) searchParams.set("sort", sort);

  const queryString = searchParams.toString();
  return queryString ? `${PRODUCTS_PATH}?${queryString}` : PRODUCTS_PATH;
}

export function getCatalogKey({ query, category, sort }: CatalogParams): string {
  return [query, category, sort].join("|");
}
