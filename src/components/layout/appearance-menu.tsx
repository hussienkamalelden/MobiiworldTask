"use client";

import { Monitor, Moon, SlidersHorizontal, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { usePreferences } from "@/hooks/use-preferences";
import type { FontSize, Theme } from "@/lib/preferences";

interface Option<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
  className?: string;
}

const THEME_OPTIONS: ReadonlyArray<Option<Theme>> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const FONT_SIZE_OPTIONS: ReadonlyArray<Option<FontSize>> = [
  { value: "sm", label: "Small", className: "text-[0.6875rem]" },
  { value: "md", label: "Default", className: "text-xs" },
  { value: "lg", label: "Large", className: "text-sm" },
];

interface OptionGroupProps<T extends string> {
  legend: string;
  name: string;
  value: T;
  options: ReadonlyArray<Option<T>>;
  onChange: (value: T) => void;
}

function OptionGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: OptionGroupProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium tracking-wide text-fg-subtle uppercase">
        {legend}
      </legend>
      <div className="grid grid-cols-3 gap-1 rounded-full bg-surface-muted p-1">
        {options.map(({ value: optionValue, label, icon: Icon, className = "text-xs" }) => (
          <label key={optionValue} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={optionValue}
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
              className="peer sr-only"
            />
            <span
              className={`flex h-8 items-center justify-center gap-1.5 rounded-full font-medium text-fg-muted transition-colors peer-checked:bg-surface peer-checked:text-fg peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus hover:text-fg ${className}`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function AppearanceMenu() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme, fontSize, setTheme, setFontSize } = usePreferences();

  useEffect(() => {
    if (!open) return;

    function isOutside(target: EventTarget | null) {
      return !(target instanceof Node && containerRef.current?.contains(target));
    }

    function handlePointerDown(event: PointerEvent) {
      if (isOutside(event.target)) setOpen(false);
    }

    function handleFocusIn(event: FocusEvent) {
      if (isOutside(event.target)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Display settings"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg aria-expanded:bg-surface-muted aria-expanded:text-fg"
      >
        <SlidersHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label="Display settings"
          className="animate-fade-in absolute top-full right-0 z-50 mt-2 w-64 space-y-4 rounded-2xl border border-line bg-surface p-4 shadow-xl shadow-black/5"
        >
          <OptionGroup
            legend="Theme"
            name="theme"
            value={theme}
            options={THEME_OPTIONS}
            onChange={setTheme}
          />
          <OptionGroup
            legend="Text size"
            name="font-size"
            value={fontSize}
            options={FONT_SIZE_OPTIONS}
            onChange={setFontSize}
          />
        </div>
      )}
    </div>
  );
}
