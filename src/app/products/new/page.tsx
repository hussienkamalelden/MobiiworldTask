import type { Metadata } from "next";
import { ProductForm } from "@/components/products/product-form";
import { AdminAccessRequired } from "@/components/roles/admin-access-required";
import { RoleGate } from "@/components/roles/role-gate";
import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { getCategories } from "@/services/product-service";

export const metadata: Metadata = {
  title: "Add Product",
};

export const revalidate = 86400;

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl">
      <RoleGate role="user">
        <AdminAccessRequired description="Only admins can add products. Switch to the Admin role to continue." />
      </RoleGate>
      <RoleGate role="admin">
        <BackLink href="/products" label="Back to products" />
        <div className="mt-6">
          <PageHeader
            title="Add Product"
            description="Fill in the details below to add a new product to the catalog."
          />
        </div>
        <ProductForm mode="create" categories={categories} />
      </RoleGate>
    </div>
  );
}
