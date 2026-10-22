"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import { dismissToast, useToasts } from "@/hooks/use-toasts";
import type { ToastTone } from "@/hooks/use-toasts";

const TONE_ICONS: Record<ToastTone, typeof CircleCheck> = {
  success: CircleCheck,
  error: CircleAlert,
};

const TONE_STYLES: Record<ToastTone, string> = {
  success: "text-success-fg",
  error: "text-danger-fg",
};

export function Toaster() {
  const toasts = useToasts();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {toasts.map((toast) => {
        const Icon = TONE_ICONS[toast.tone];
        return (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className="animate-fade-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-xl shadow-black/10"
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${TONE_STYLES[toast.tone]}`} />
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
        );
      })}
    </div>
  );
}
