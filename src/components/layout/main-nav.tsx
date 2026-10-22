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

interface NavListProps {
  pathname: string | null;
}

export function NavList({ pathname }: NavListProps) {
  return (
    <ul className="flex items-center gap-1 sm:gap-2">
      {NAV_ITEMS.map((item) => {
        const active = pathname !== null && item.isActive(pathname);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-800"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function MainNav() {
  const pathname = usePathname();
  return <NavList pathname={pathname} />;
}
