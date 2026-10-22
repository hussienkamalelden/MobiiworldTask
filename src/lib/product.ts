import type {
  Product,
  ProductDimensions,
  ProductInput,
  ProductSummary,
} from "@/types/product";

export type AvailabilityTone = "success" | "warning" | "danger";

const LOCAL_PRODUCT_ID_MIN = 1_000_000_000_000;

const LOW_STOCK_THRESHOLD = 10;

export function parseProductId(id: string | number): number | null {
  const parsed = typeof id === "number" ? id : Number(id);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export function isLocalProductId(id: number): boolean {
  return id >= LOCAL_PRODUCT_ID_MIN;
}

export function getOriginalPrice(
  price: number,
  discountPercentage: number,
): number | null {
  if (discountPercentage <= 0 || discountPercentage >= 100) return null;
  return price / (1 - discountPercentage / 100);
}

function getAvailabilityStatus(stock: number): string {
  if (stock <= 0) return "Out of Stock";
  if (stock < LOW_STOCK_THRESHOLD) return "Low Stock";
  return "In Stock";
}

export function getAvailabilityTone(
  product: Pick<Product, "availabilityStatus" | "stock">,
): AvailabilityTone {
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

export function toProductSummary(product: Product): ProductSummary {
  return {
    id: product.id,
    title: product.title,
    category: product.category,
    price: product.price,
    rating: product.rating,
    thumbnail: product.thumbnail,
  };
}

export function createLocalProduct(input: ProductInput, id: number): Product {
  const now = new Date().toISOString();

  return {
    ...input,
    id,
    brand: input.brand || undefined,
    discountPercentage: 0,
    tags: [],
    sku: `LOCAL-${id}`,
    weight: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: getAvailabilityStatus(input.stock),
    reviews: [],
    returnPolicy: "",
    minimumOrderQuantity: 1,
    meta: { createdAt: now, updatedAt: now, barcode: "", qrCode: "" },
    images: input.thumbnail ? [input.thumbnail] : [],
  };
}

export function applyProductInput(product: Product, input: ProductInput): Product {
  const thumbnailChanged = input.thumbnail !== product.thumbnail;

  return {
    ...product,
    ...input,
    brand: input.brand || undefined,
    availabilityStatus: getAvailabilityStatus(input.stock),
    images:
      thumbnailChanged && input.thumbnail
        ? [input.thumbnail, ...product.images.filter((image) => image !== input.thumbnail)]
        : product.images,
    meta: { ...product.meta, updatedAt: new Date().toISOString() },
  };
}
