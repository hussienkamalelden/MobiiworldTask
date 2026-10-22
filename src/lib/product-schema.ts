import { z } from "zod";
import type { Product, ProductInput } from "@/types/product";

export const PRODUCT_LIMITS = {
  titleMin: 3,
  titleMax: 100,
  brandMax: 60,
  descriptionMax: 1000,
  priceMax: 1_000_000,
  ratingMin: 0,
  ratingMax: 5,
} as const;

const NUMBER_PATTERN = /^-?(\d+\.?\d*|\.\d+)$/;
const MAX_TWO_DECIMALS_PATTERN = /^-?\d*(\.\d{0,2})?$/;

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

function optionalNumber(label: string) {
  return z
    .string()
    .trim()
    .refine((value) => value === "" || NUMBER_PATTERN.test(value), {
      message: `${label} must be a valid number.`,
    })
    .transform((value) => (value === "" ? 0 : Number(value)));
}

export function createProductSchema(categorySlugs: ReadonlyArray<string>) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .min(PRODUCT_LIMITS.titleMin, `Title must be at least ${PRODUCT_LIMITS.titleMin} characters.`)
      .max(PRODUCT_LIMITS.titleMax, `Title must be ${PRODUCT_LIMITS.titleMax} characters or fewer.`),
    brand: z
      .string()
      .trim()
      .max(PRODUCT_LIMITS.brandMax, `Brand must be ${PRODUCT_LIMITS.brandMax} characters or fewer.`),
    category: z
      .string()
      .trim()
      .min(1, "Category is required.")
      .refine((value) => value === "" || categorySlugs.includes(value), {
        message: "Select a valid category.",
      }),
    description: z
      .string()
      .trim()
      .max(
        PRODUCT_LIMITS.descriptionMax,
        `Description must be ${PRODUCT_LIMITS.descriptionMax} characters or fewer.`,
      ),
    price: z
      .string()
      .trim()
      .min(1, "Price is required.")
      .regex(NUMBER_PATTERN, "Price must be a valid number.")
      .regex(MAX_TWO_DECIMALS_PATTERN, "Price can have at most 2 decimal places.")
      .transform(Number)
      .pipe(
        z
          .number()
          .positive("Price must be a positive number.")
          .max(PRODUCT_LIMITS.priceMax, "Price must be 1,000,000 or less."),
      ),
    stock: optionalNumber("Stock").pipe(
      z.number().int("Stock must be a whole number.").min(0, "Stock cannot be negative."),
    ),
    rating: optionalNumber("Rating").pipe(
      z
        .number()
        .min(PRODUCT_LIMITS.ratingMin, `Rating must be between ${PRODUCT_LIMITS.ratingMin} and ${PRODUCT_LIMITS.ratingMax}.`)
        .max(PRODUCT_LIMITS.ratingMax, `Rating must be between ${PRODUCT_LIMITS.ratingMin} and ${PRODUCT_LIMITS.ratingMax}.`),
    ),
    thumbnail: z
      .string()
      .trim()
      .refine((value) => value === "" || isHttpUrl(value), {
        message: "Enter a valid URL starting with http:// or https://.",
      }),
  }) satisfies z.ZodType<ProductInput, ProductFormValues>;
}

export interface ProductFormValues {
  title: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  rating: string;
  thumbnail: string;
}

export type ProductFormField = keyof ProductFormValues;

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  title: "",
  brand: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  rating: "",
  thumbnail: "",
};

export function toProductFormValues(product: Product): ProductFormValues {
  return {
    title: product.title,
    brand: product.brand ?? "",
    category: product.category,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    rating: String(product.rating),
    thumbnail: product.thumbnail,
  };
}
