const SKELETON_CARDS = 8;

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-square animate-pulse rounded-2xl bg-line" />
      <div className="mt-3 space-y-2 px-1">
        <div className="h-3 w-16 animate-pulse rounded-full bg-line" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-line" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 w-16 animate-pulse rounded-full bg-line" />
          <div className="h-4 w-10 animate-pulse rounded-full bg-line" />
        </div>
      </div>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading products...</span>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="h-11 flex-1 animate-pulse rounded-full bg-line" />
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <div className="h-11 animate-pulse rounded-full bg-line sm:w-48" />
          <div className="h-11 animate-pulse rounded-full bg-line sm:w-48" />
        </div>
      </div>
      <div className="mt-6 mb-6 h-5 w-32 animate-pulse rounded-full bg-line" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: SKELETON_CARDS }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
