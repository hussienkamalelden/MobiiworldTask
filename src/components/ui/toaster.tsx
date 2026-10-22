"use client";

import { CircleCheck, X } from "lucide-react";
import { dismissToast, useToasts } from "@/hooks/use-toasts";

export function Toaster() {
  const toasts = useToasts();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-fade-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-xl shadow-black/10"
        >
          <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success-fg" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-fg">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-sm text-fg-muted">{toast.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="-m-1 rounded-full p-1 text-fg-subtle transition-colors hover:bg-surface-muted hover:text-fg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
