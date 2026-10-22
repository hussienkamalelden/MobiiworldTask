import type { Product, ProductDimensions } from "@/types/product";

export type AvailabilityTone = "success" | "warning" | "danger";

export function getOriginalPrice(
  price: number,
  discountPercentage: number,
): number | null {
  if (discountPercentage <= 0 || discountPercentage >= 100) return null;
  return price / (1 - discountPercentage / 100);
}

export function getAvailabilityTone(product: Pick<Product, "availabilityStatus" | "stock">): AvailabilityTone {
  if (product.stock <= 0 || product.availabilityStatus === "Out of Stock") {
    return "danger";
  }
  if (product.availabilityStatus === "Low Stock") return "warning";
  return "success";
}

export function formatDimensions({ width, height, depth }: ProductDimensions): string {
  return `${width} × ${height} × ${depth}`;
}

export function getProductImages(product: Pick<Product, "images" | "thumbnail">): string[] {
  const images = product.images.filter(Boolean);
  return images.length > 0 ? images : [product.thumbnail];
}
