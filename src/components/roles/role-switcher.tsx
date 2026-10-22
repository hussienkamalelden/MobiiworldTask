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
  iconStyles: string;
  cardStyles: string;
  checkStyles: string;
}

const ROLE_OPTIONS: ReadonlyArray<RoleOption> = [
  {
    value: "admin",
    label: "Admin",
    description: "Can add, edit and delete products.",
    icon: ShieldCheck,
    iconStyles: "bg-role-admin-soft text-role-admin-fg",
    cardStyles: "has-[:checked]:border-role-admin-line has-[:checked]:bg-role-admin-soft",
    checkStyles: "text-role-admin-fg",
  },
  {
    value: "user",
    label: "User",
    description: "Can browse and view products only.",
    icon: UserRound,
    iconStyles: "bg-role-user-soft text-role-user-fg",
    cardStyles: "has-[:checked]:border-role-user-line has-[:checked]:bg-role-user-soft",
    checkStyles: "text-role-user-fg",
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
      buttonClassName="flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors role-admin:border-role-admin-line role-admin:bg-role-admin-soft role-admin:text-role-admin-fg role-user:border-role-user-line role-user:bg-role-user-soft role-user:text-role-user-fg hover:brightness-95 dark:hover:brightness-125"
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
          <ChevronDown className="hidden h-3.5 w-3.5 opacity-70 sm:block" />
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
            {ROLE_OPTIONS.map(
              ({ value, label, description, icon: Icon, iconStyles, cardStyles, checkStyles }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 transition-colors hover:bg-surface-muted has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${cardStyles}`}
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
                        title: `Switched to ${label}`,
                        description,
                      });
                    }}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconStyles}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-fg">{label}</span>
                    <span className="block text-xs text-fg-muted">{description}</span>
                  </span>
                  <Check
                    className={`mt-1 h-4 w-4 opacity-0 peer-checked:opacity-100 ${checkStyles}`}
                  />
                </label>
              ),
            )}
          </div>
        </fieldset>
      )}
    </Popover>
  );
}
