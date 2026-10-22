import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <PageHeader
      title="Products"
      description="Browse, search and filter the full product catalog."
    />
  );
}
