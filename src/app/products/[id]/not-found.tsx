import { PackageX } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProductNotFound() {
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
