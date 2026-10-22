import { Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      headingLevel="h1"
      title="Page not found"
      description="The page you are looking for does not exist or has been moved."
      action={
        <Link href="/products" className={buttonStyles()}>
          Browse products
        </Link>
      }
    />
  );
}
