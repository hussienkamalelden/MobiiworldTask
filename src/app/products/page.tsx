import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogSkeleton } from "@/components/products/catalog-skeleton";
import { ProductCatalog } from "@/components/products/product-catalog";
import { PageHeader } from "@/components/ui/page-header";
import { parseCatalogParams, toProductListQuery } from "@/lib/catalog";
import { getCategories, getProducts } from "@/services/product-service";

export const metadata: Metadata = {
  title: "Products",
};

type ProductsPageProps = PageProps<"/products">;

async function ProductCatalogLoader({
  searchParams,
}: Pick<ProductsPageProps, "searchParams">) {
  const [rawParams, categories] = await Promise.all([
    searchParams,
    getCategories(),
  ]);
  const { params, hasConflict } = parseCatalogParams(
    rawParams,
    categories.map((category) => category.slug),
  );
  const initialPage = await getProducts(toProductListQuery(params, 0));

  return (
    <ProductCatalog
      categories={categories}
      initialPage={initialPage}
      params={params}
      hasConflict={hasConflict}
    />
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <>
      <PageHeader
        title="Products"
        description="Discover and manage everything in the catalog."
      />
      <Suspense fallback={<CatalogSkeleton />}>
        <ProductCatalogLoader searchParams={searchParams} />
      </Suspense>
    </>
  );
}
