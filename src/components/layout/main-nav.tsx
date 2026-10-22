"use client";

import { LayoutGrid, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly: boolean;
  isActive: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/products",
    label: "Products",
    icon: LayoutGrid,
    adminOnly: false,
    isActive: (pathname) =>
      pathname === "/products" ||
      (pathname.startsWith("/products/") && pathname !== "/products/new"),
  },
  {
    href: "/products/new",
    label: "Add Product",
    icon: Plus,
    adminOnly: true,
    isActive: (pathname) => pathname === "/products/new",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-0.5 sm:gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, adminOnly, isActive }) => {
          const active = isActive(pathname);
          return (
            <li key={href} className={adminOnly ? "hidden role-admin:block" : undefined}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                title={label}
                className={`inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-3.5 ${
                  active
                    ? "bg-accent-soft text-accent-soft-fg"
                    : "text-fg-muted hover:bg-surface-muted hover:text-fg"
                }`}
              >
                <Icon className="h-4 w-4 sm:hidden" />
                <span className="sr-only sm:not-sr-only">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
