import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";
import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { getCategories, getProductById } from "@/services/product-service";

type EditProductPageProps = PageProps<"/products/[id]/edit">;

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: product ? `Edit ${product.title}` : "Product not found" };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={`/products/${product.id}`} label="Back to product" />
      <div className="mt-6">
        <PageHeader
          title="Edit Product"
          description={`Update the details for "${product.title}".`}
        />
      </div>
      <ProductForm mode="edit" product={product} categories={categories} />
    </div>
  );
}
