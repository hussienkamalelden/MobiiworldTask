import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditProductResolver } from "@/components/products/edit-product-resolver";
import { AdminAccessRequired } from "@/components/roles/admin-access-required";
import { RoleGate } from "@/components/roles/role-gate";
import { isLocalProductId, parseProductId } from "@/lib/product";
import { getCategories, getProductById } from "@/services/product-service";

type EditProductPageProps = PageProps<"/products/[id]/edit">;

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const productId = parseProductId((await params).id);

  if (productId !== null && isLocalProductId(productId)) {
    return { title: "Edit product" };
  }

  const product = productId === null ? null : await getProductById(productId);
  return { title: product ? `Edit ${product.title}` : "Product not found" };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productId = parseProductId((await params).id);

  if (productId === null) {
    notFound();
  }

  const isLocal = isLocalProductId(productId);
  const [apiProduct, categories] = await Promise.all([
    isLocal ? null : getProductById(productId),
    getCategories(),
  ]);

  if (!isLocal && !apiProduct) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <RoleGate role="user">
        <AdminAccessRequired description="Only admins can edit products. Switch to the Admin role to continue." />
      </RoleGate>
      <RoleGate role="admin">
        <EditProductResolver
          productId={productId}
          apiProduct={apiProduct}
          categories={categories}
        />
      </RoleGate>
    </div>
  );
}
