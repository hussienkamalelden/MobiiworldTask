import { Info, X } from "lucide-react";

interface NoticeProps {
  message: string;
  onDismiss: () => void;
}

export function Notice({ message, onDismiss }: NoticeProps) {
  return (
    <div
      role="status"
      className="animate-fade-in flex items-start gap-3 rounded-2xl border border-warning-line bg-warning-soft px-4 py-3 text-sm text-warning-fg"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notice"
        className="-m-1 rounded-full p-1 text-warning-fg opacity-70 transition hover:bg-warning-line hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
