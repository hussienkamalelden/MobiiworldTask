import { Store } from "lucide-react";
import Link from "next/link";
import { RoleSwitcher } from "@/components/roles/role-switcher";
import { MainNav } from "./main-nav";
import { SettingsMenu } from "./settings-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="flex shrink-0 items-center gap-2.5 rounded-full text-sm font-semibold tracking-tight text-fg"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-white">
            <Store className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Product Catalog</span>
          <span className="sr-only sm:hidden">Product Catalog</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <MainNav />
          <RoleSwitcher />
          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}
