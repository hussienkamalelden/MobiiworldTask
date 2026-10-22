"use client";

import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { useProductChanges } from "@/hooks/use-product-changes";
import { resolveProduct } from "@/lib/product-changes";
import type { Product } from "@/types/product";
import { PageSkeleton } from "@/components/ui/skeleton";
import { ProductDetails } from "./product-details";
import { DeletedProductView, ProductNotFoundView } from "./product-status-views";

interface ProductDetailsResolverProps {
  productId: number;
  apiProduct: Product | null;
}

export function ProductDetailsResolver({ productId, apiProduct }: ProductDetailsResolverProps) {
  const changes = useProductChanges();
  const isHydrated = useIsHydrated();
  const resolved = resolveProduct(productId, apiProduct, changes);

  if (resolved.status === "available") {
    return <ProductDetails product={resolved.product} isLocal={resolved.isLocal} />;
  }
  if (!isHydrated) {
    return <PageSkeleton variant="details" label="Loading product..." />;
  }
  if (resolved.status === "deleted") {
    return <DeletedProductView productId={productId} />;
  }
  return <ProductNotFoundView />;
}
