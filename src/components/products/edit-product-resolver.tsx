"use client";

import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { useProductChanges } from "@/hooks/use-product-changes";
import { resolveProduct } from "@/lib/product-changes";
import type { Category, Product } from "@/types/product";
import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/skeleton";
import { ProductForm } from "./product-form";
import { DeletedProductView, ProductNotFoundView } from "./product-status-views";

interface EditProductResolverProps {
  productId: number;
  apiProduct: Product | null;
  categories: Category[];
}

export function EditProductResolver({
  productId,
  apiProduct,
  categories,
}: EditProductResolverProps) {
  const changes = useProductChanges();
  const isHydrated = useIsHydrated();
  const resolved = resolveProduct(productId, apiProduct, changes);

  if (resolved.status !== "available") {
    if (!isHydrated) return <PageSkeleton variant="form" label="Loading product..." />;
    if (resolved.status === "deleted") return <DeletedProductView productId={productId} />;
    return <ProductNotFoundView />;
  }

  const { product } = resolved;

  return (
    <>
      <BackLink href={`/products/${product.id}`} label="Back to product" />
      <div className="mt-6">
        <PageHeader
          title="Edit Product"
          description={`Update the details for "${product.title}".`}
        />
      </div>
      <ProductForm
        key={`${product.id}-${product.meta.updatedAt}`}
        mode="edit"
        product={product}
        categories={categories}
      />
    </>
  );
}
