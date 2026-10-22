import { applyProductInput, createLocalProduct, isLocalProductId } from "@/lib/product";
import type { Product, ProductInput } from "@/types/product";
import {
  generateLocalProductId,
  markProductDeleted,
  saveProduct,
} from "./local-product-store";
import { createProduct, deleteProduct, updateProduct } from "./product-service";

export async function createCatalogProduct(input: ProductInput): Promise<Product> {
  await createProduct(input);
  const product = createLocalProduct(input, generateLocalProductId());
  saveProduct(product);
  return product;
}

export async function updateCatalogProduct(
  product: Product,
  input: ProductInput,
): Promise<Product> {
  if (!isLocalProductId(product.id)) {
    await updateProduct(product.id, input);
  }
  const updated = applyProductInput(product, input);
  saveProduct(updated);
  return updated;
}

export async function deleteCatalogProduct(product: Product): Promise<void> {
  if (!isLocalProductId(product.id)) {
    await deleteProduct(product.id);
  }
  markProductDeleted(product);
}
