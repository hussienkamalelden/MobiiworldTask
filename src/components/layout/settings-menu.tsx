"use client";

import { Monitor, Moon, RotateCcw, SlidersHorizontal, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { usePreferences } from "@/hooks/use-preferences";
import { useProductChanges } from "@/hooks/use-product-changes";
import { showToast } from "@/hooks/use-toasts";
import type { FontSize, Theme } from "@/lib/preferences";
import { countProductChanges } from "@/lib/product-changes";
import { resetProductChanges } from "@/services/local-product-store";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Popover } from "@/components/ui/popover";

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

export function SettingsMenu() {
  const { theme, fontSize, setTheme, setFontSize } = usePreferences();
  const changeCount = countProductChanges(useProductChanges());
  const [isResetOpen, setIsResetOpen] = useState(false);

  function handleReset() {
    resetProductChanges();
    setIsResetOpen(false);
    showToast({
      title: "Local changes cleared",
      description: "The catalog now shows the original data from the API.",
    });
  }

  return (
    <>
      <Popover
        buttonLabel="Settings"
        panelLabel="Settings"
        buttonClassName="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg aria-expanded:bg-surface-muted aria-expanded:text-fg"
        buttonContent={<SlidersHorizontal className="h-4 w-4" />}
      >
        {(close) => (
          <div className="space-y-4">
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
            <div className="border-t border-line pt-4">
              <p className="text-xs font-medium tracking-wide text-fg-subtle uppercase">
                Local changes
              </p>
              <p className="mt-1 text-xs text-fg-muted">
                {changeCount === 0
                  ? "No changes are saved in this browser."
                  : `${changeCount} ${changeCount === 1 ? "change is" : "changes are"} saved in this browser.`}
              </p>
              <Button
                variant="secondary"
                size="sm"
                disabled={changeCount === 0}
                onClick={() => {
                  close();
                  setIsResetOpen(true);
                }}
                className="mt-3 w-full"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset local changes
              </Button>
            </div>
          </div>
        )}
      </Popover>

      <ConfirmDialog
        open={isResetOpen}
        title="Reset local changes?"
        description="All products you created, edited or deleted in this browser will return to the original API data."
        confirmLabel="Reset changes"
        pendingLabel="Resetting..."
        onConfirm={handleReset}
        onCancel={() => setIsResetOpen(false)}
      />
    </>
  );
}
