import type {
  Category,
  DeletedProduct,
  Product,
  ProductInput,
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

export async function getProducts(
  signal?: AbortSignal,
): Promise<ProductSummary[]> {
  const params = new URLSearchParams({
    limit: "0",
    select: SUMMARY_FIELDS.join(","),
  });
  const data = await request<ProductsResponse<ProductSummary>>(
    `/products?${params.toString()}`,
    { signal },
  );
  return data.products;
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
