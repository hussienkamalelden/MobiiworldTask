"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast } from "@/hooks/use-toasts";
import { isLocalProductId } from "@/lib/product";
import { ApiError } from "@/services/api-client";
import { deleteCatalogProduct } from "@/services/product-mutations";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeleteProductButtonProps {
  product: Product;
}

export function DeleteProductButton({ product }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCancel() {
    setIsOpen(false);
    setError(null);
  }

  async function handleConfirm() {
    setIsPending(true);
    setError(null);

    try {
      await deleteCatalogProduct(product);
      showToast({
        tone: "success",
        title: "Product deleted",
        description: `"${product.title}" was removed from the catalog.`,
      });
      router.push("/products");
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? deleteError.message
          : "Something went wrong. Please try again.",
      );
      setIsPending(false);
    }
  }

  return (
    <>
      <Button variant="danger-outline" size="sm" onClick={() => setIsOpen(true)}>
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
      <ConfirmDialog
        open={isOpen}
        title="Delete this product?"
        description={
          <>
            <p>
              <span className="font-semibold text-fg">&ldquo;{product.title}&rdquo;</span>{" "}
              {isLocalProductId(product.id)
                ? "only exists in this browser and will be permanently removed."
                : "will be removed from the catalog. You can restore it later from its page."}
            </p>
            {error && (
              <p role="alert" className="mt-3 font-medium text-danger-fg">
                {error}
              </p>
            )}
          </>
        }
        confirmLabel="Delete product"
        pendingLabel="Deleting..."
        isPending={isPending}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
