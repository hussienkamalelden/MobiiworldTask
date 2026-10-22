"use client";

import { PackageX, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/hooks/use-toasts";
import { restoreDeletedProduct } from "@/services/local-product-store";
import { RoleGate } from "@/components/roles/role-gate";
import { Button, buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function ProductNotFoundView() {
  return (
    <EmptyState
      icon={PackageX}
      headingLevel="h1"
      title="Product not found"
      description="The product you are looking for does not exist or may have been removed."
      action={
        <Link href="/products" className={buttonStyles()}>
          Back to products
        </Link>
      }
    />
  );
}

interface DeletedProductViewProps {
  productId: number;
}

export function DeletedProductView({ productId }: DeletedProductViewProps) {
  return (
    <EmptyState
      icon={Trash2}
      headingLevel="h1"
      title="Product deleted"
      description="This product was deleted in this browser."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/products" className={buttonStyles()}>
            Back to products
          </Link>
          <RoleGate role="admin">
            <Button
              variant="secondary"
              onClick={() => {
                restoreDeletedProduct(productId);
                showToast({ title: "Product restored" });
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Restore product
            </Button>
          </RoleGate>
        </div>
      }
    />
  );
}
