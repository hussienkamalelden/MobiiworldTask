import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function getFieldDescriptionId(id: string, { error, hint }: { error?: string; hint?: string }) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function fieldStyles(hasError: boolean): string {
  return `w-full rounded-xl border bg-surface px-4 text-sm text-fg transition-colors placeholder:text-fg-subtle disabled:opacity-60 ${
    hasError
      ? "border-danger-fg"
      : "border-line hover:border-accent-line"
  }`;
}

export function FormField({ id, label, required = false, hint, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger-fg">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-danger-fg">
          <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-fg-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
