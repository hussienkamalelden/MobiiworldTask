import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailsResolver } from "@/components/products/product-details-resolver";
import { isLocalProductId, parseProductId } from "@/lib/product";
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
  const productId = parseProductId((await params).id);

  if (productId !== null && isLocalProductId(productId)) {
    return { title: "Product details" };
  }

  const product = productId === null ? null : await getProductById(productId);

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
  const productId = parseProductId((await params).id);

  if (productId === null) {
    notFound();
  }

  if (isLocalProductId(productId)) {
    return <ProductDetailsResolver productId={productId} apiProduct={null} />;
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailsResolver productId={productId} apiProduct={product} />;
}
