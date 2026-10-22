import { SearchX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: LucideIcon;
  headingLevel?: "h1" | "h2";
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = SearchX,
  headingLevel: Heading = "h2",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-line bg-surface px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-fg">
        <Icon className="h-6 w-6" />
      </span>
      <Heading className="mt-4 text-base font-semibold text-fg">{title}</Heading>
      <p className="mt-1 max-w-sm text-sm text-fg-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
