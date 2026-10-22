import type { AvailabilityTone } from "@/lib/product";

const TONE_STYLES: Record<AvailabilityTone, string> = {
  success: "bg-success-soft text-success-fg",
  warning: "bg-warning-soft text-warning-fg",
  danger: "bg-danger-soft text-danger-fg",
};

interface AvailabilityBadgeProps {
  label: string;
  tone: AvailabilityTone;
}

export function AvailabilityBadge({ label, tone }: AvailabilityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_STYLES[tone]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
