import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

const BASE_STYLES =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-brand-700 text-white shadow-sm hover:bg-brand-800",
  secondary:
    "border border-stone-200 bg-white text-stone-900 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-stone-600 hover:bg-brand-50 hover:text-brand-800",
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
  extends ButtonHTMLAttributes<HTMLButtonElement>,
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
