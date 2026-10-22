import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Add Product",
};

export default function NewProductPage() {
  return (
    <PageHeader
      title="Add Product"
      description="Fill in the details below to add a new product to the catalog."
    />
  );
}
