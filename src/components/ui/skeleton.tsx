interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return <div aria-hidden="true" className={`animate-pulse rounded-2xl bg-line ${className}`} />;
}

interface PageSkeletonProps {
  label: string;
  variant: "details" | "form";
}

export function PageSkeleton({ label, variant }: PageSkeletonProps) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-5 w-36 rounded-full" />
      {variant === "details" ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      )}
    </div>
  );
}
