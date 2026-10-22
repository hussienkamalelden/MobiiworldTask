import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/products/product-details";
import { getProductById, getProducts } from "@/services/product-service";

type ProductPageProps = PageProps<"/products/[id]">;

const PRERENDERED_PRODUCTS = 12;

export const revalidate = 3600;

export async function generateStaticParams() {
  const { products } = await getProducts({ limit: PRERENDERED_PRODUCTS, skip: 0 });
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.thumbnail ? [product.thumbnail] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
