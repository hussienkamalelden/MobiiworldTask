export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
}

export type ProductSummary = Pick<
  Product,
  "id" | "title" | "category" | "price" | "rating" | "thumbnail"
>;

export interface ProductsResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}

export type SortField = "price" | "rating";

export type SortOrder = "asc" | "desc";

export type ProductFilter =
  | { type: "search"; query: string }
  | { type: "category"; slug: string };

export interface ProductListQuery {
  filter?: ProductFilter;
  sortBy?: SortField;
  order?: SortOrder;
  limit: number;
  skip: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
}

export type SavedProduct = Partial<Product> & Pick<Product, "id">;

export interface DeletedProduct extends Product {
  isDeleted: boolean;
  deletedOn: string;
}
