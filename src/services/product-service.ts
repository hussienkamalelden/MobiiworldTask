import type {
  Category,
  DeletedProduct,
  Product,
  ProductFilter,
  ProductInput,
  ProductListQuery,
  ProductSummary,
  ProductsResponse,
  SavedProduct,
} from "@/types/product";
import { isNotFoundError, request } from "./api-client";

const SUMMARY_FIELDS: ReadonlyArray<keyof ProductSummary> = [
  "id",
  "title",
  "category",
  "price",
  "discountPercentage",
  "rating",
  "stock",
  "brand",
  "thumbnail",
];

function parseProductId(id: string | number): number | null {
  const parsed = typeof id === "number" ? id : Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function getProductListPath(filter: ProductFilter | undefined): string {
  if (filter?.type === "search") return "/products/search";
  if (filter?.type === "category") {
    return `/products/category/${encodeURIComponent(filter.slug)}`;
  }
  return "/products";
}

export async function getProducts(
  { filter, sortBy, order = "asc", limit, skip }: ProductListQuery,
  signal?: AbortSignal,
): Promise<ProductsResponse<ProductSummary>> {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: SUMMARY_FIELDS.join(","),
  });

  if (filter?.type === "search") {
    params.set("q", filter.query);
  }

  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  return request<ProductsResponse<ProductSummary>>(
    `${getProductListPath(filter)}?${params.toString()}`,
    { signal },
  );
}

export async function getProductById(
  id: string | number,
): Promise<Product | null> {
  const productId = parseProductId(id);
  if (productId === null) {
    return null;
  }

  try {
    return await request<Product>(`/products/${productId}`);
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  return request<Category[]>("/products/categories", { signal });
}

export async function createProduct(
  input: ProductInput,
): Promise<SavedProduct> {
  return request<SavedProduct>("/products/add", {
    method: "POST",
    body: input,
  });
}

export async function updateProduct(
  id: number,
  input: ProductInput,
): Promise<SavedProduct> {
  return request<SavedProduct>(`/products/${id}`, {
    method: "PUT",
    body: input,
  });
}

export async function deleteProduct(id: number): Promise<DeletedProduct> {
  return request<DeletedProduct>(`/products/${id}`, { method: "DELETE" });
}
