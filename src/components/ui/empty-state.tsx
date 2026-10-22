import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-stone-200/70 bg-white px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <SearchX className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-stone-900">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-stone-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
