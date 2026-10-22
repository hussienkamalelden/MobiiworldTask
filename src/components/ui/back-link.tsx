import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackLinkProps {
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-fg-muted transition-colors hover:text-fg"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
