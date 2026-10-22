import { Store } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { MainNav, NavList } from "./main-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="flex items-center gap-2.5 rounded-full text-sm font-semibold tracking-tight text-stone-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-700 text-white">
            <Store className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Product Catalog</span>
          <span className="sr-only sm:hidden">Product Catalog</span>
        </Link>
        <nav aria-label="Main">
          <Suspense fallback={<NavList pathname={null} />}>
            <MainNav />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
