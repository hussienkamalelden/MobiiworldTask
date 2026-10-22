import { Store } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link
      href="/products"
      className="flex shrink-0 items-center gap-2.5 rounded-xl text-sm font-semibold tracking-tight text-fg"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-teal-700 text-white shadow-sm shadow-teal-700/30">
        <Store className="h-4 w-4" />
      </span>
      <span className={compact ? "hidden sm:inline" : undefined}>Product Catalog</span>
      {compact && <span className="sr-only sm:hidden">Product Catalog</span>}
    </Link>
  );
}
