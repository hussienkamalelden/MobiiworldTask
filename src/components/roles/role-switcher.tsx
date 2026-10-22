"use client";

import { Check, ChevronDown, ShieldCheck, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePreferences } from "@/hooks/use-preferences";
import { showToast } from "@/hooks/use-toasts";
import type { Role } from "@/lib/preferences";
import { Popover } from "@/components/ui/popover";

interface RoleOption {
  value: Role;
  label: string;
  description: string;
  icon: LucideIcon;
}

const ROLE_OPTIONS: ReadonlyArray<RoleOption> = [
  {
    value: "admin",
    label: "Admin",
    description: "Can add, edit and delete products.",
    icon: ShieldCheck,
  },
  {
    value: "user",
    label: "User",
    description: "Can browse and view products only.",
    icon: UserRound,
  },
];

export function RoleSwitcher() {
  const { role, setRole } = usePreferences();
  const current = ROLE_OPTIONS.find((option) => option.value === role) ?? ROLE_OPTIONS[0];

  return (
    <Popover
      buttonLabel={`Current role: ${current.label}. Change role`}
      panelLabel="Choose a role"
      panelClassName="w-72"
      buttonClassName="flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors role-admin:border-accent-line role-admin:bg-accent-soft role-admin:text-accent-soft-fg role-user:border-line role-user:bg-surface-muted role-user:text-fg-muted hover:opacity-85"
      buttonContent={
        <>
          <span className="hidden items-center gap-1.5 role-admin:inline-flex">
            <ShieldCheck className="h-4 w-4" />
            Admin
          </span>
          <span className="hidden items-center gap-1.5 role-user:inline-flex">
            <UserRound className="h-4 w-4" />
            User
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </>
      }
    >
      {(close) => (
        <fieldset>
          <legend className="mb-1 text-xs font-medium tracking-wide text-fg-subtle uppercase">
            Viewing as
          </legend>
          <p className="mb-3 text-xs text-fg-muted">
            Switch roles to preview what each type of user can do.
          </p>
          <div className="space-y-2">
            {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
              <label
                key={value}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 transition-colors hover:border-accent-line has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus"
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={role === value}
                  onChange={() => {
                    setRole(value);
                    close();
                    showToast({
                      tone: "success",
                      title: `Switched to ${label}`,
                      description,
                    });
                  }}
                  className="peer sr-only"
                />
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-fg-muted peer-checked:bg-accent peer-checked:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-fg">{label}</span>
                  <span className="block text-xs text-fg-muted">{description}</span>
                </span>
                <Check className="mt-1 h-4 w-4 text-accent-fg opacity-0 peer-checked:opacity-100" />
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </Popover>
  );
}
