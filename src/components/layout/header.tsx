import Link from "next/link";
import { Suspense } from "react";
import { MainNav, NavList } from "./main-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="flex items-center gap-2 rounded-md text-base font-semibold text-slate-900"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white"
          >
            PC
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
