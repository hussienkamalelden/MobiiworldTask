import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

const LINK_STYLES =
  "inline-flex items-center gap-1 rounded text-fg-muted transition-colors hover:text-fg";

const RESOURCES = [
  { href: "https://dummyjson.com/docs/products", label: "DummyJSON API" },
  { href: "https://nextjs.org/docs", label: "Next.js docs" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:grid-cols-[2fr_1fr_1fr] sm:px-6 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
            Browse, search and manage products with live data from the DummyJSON API.
          </p>
        </div>

        <nav aria-labelledby="footer-catalog">
          <p
            id="footer-catalog"
            className="text-xs font-semibold tracking-wide text-fg-subtle uppercase"
          >
            Catalog
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/products" className={LINK_STYLES}>
                All products
              </Link>
            </li>
            <li className="hidden role-admin:list-item">
              <Link href="/products/new" className={LINK_STYLES}>
                Add product
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p
            id="footer-resources"
            className="text-xs font-semibold tracking-wide text-fg-subtle uppercase"
          >
            Resources
          </p>
          <ul aria-labelledby="footer-resources" className="mt-4 space-y-3 text-sm">
            {RESOURCES.map((resource) => (
              <li key={resource.href}>
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_STYLES}
                >
                  {resource.label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-fg-subtle sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Product Catalog</p>
          <p>
            Product data provided by{" "}
            <a
              href="https://dummyjson.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded font-medium text-accent-fg underline-offset-4 hover:underline"
            >
              DummyJSON
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
