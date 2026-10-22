import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "danger-outline" | "ghost";
type ButtonSize = "sm" | "md";

const BASE_STYLES =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white shadow-sm hover:bg-accent-hover",
  secondary:
    "border border-line bg-surface text-fg hover:border-accent-line hover:bg-accent-soft hover:text-accent-soft-fg",
  danger: "bg-danger text-white hover:bg-danger-hover",
  "danger-outline":
    "border border-danger-line bg-surface text-danger-fg hover:bg-danger-soft",
  ghost: "text-fg-muted hover:bg-accent-soft hover:text-accent-soft-fg",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
}: ButtonStyleOptions = {}): string {
  return `${BASE_STYLES} ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`.trim();
}

interface ButtonProps
  extends ComponentProps<"button">,
    ButtonStyleOptions {}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
