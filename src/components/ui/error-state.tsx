import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

interface ErrorStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-3xl border border-red-100 bg-red-50/60 px-6 py-20 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
        <CircleAlert className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-stone-900">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-stone-700">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
