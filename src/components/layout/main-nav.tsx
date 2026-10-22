"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/products",
    label: "Products",
    isActive: (pathname) =>
      pathname === "/products" ||
      (pathname.startsWith("/products/") && pathname !== "/products/new"),
  },
  {
    href: "/products/new",
    label: "Add Product",
    isActive: (pathname) => pathname === "/products/new",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-0.5 sm:gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:px-3.5 ${
                  active
                    ? "bg-accent-soft text-accent-soft-fg"
                    : "text-fg-muted hover:bg-surface-muted hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
