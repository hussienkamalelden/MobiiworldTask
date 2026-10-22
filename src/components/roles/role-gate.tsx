import type { ReactNode } from "react";
import type { Role } from "@/lib/preferences";

const VISIBILITY_STYLES: Record<Role, string> = {
  admin: "hidden role-admin:contents",
  user: "hidden role-user:contents",
};

interface RoleGateProps {
  role: Role;
  children: ReactNode;
}

export function RoleGate({ role, children }: RoleGateProps) {
  return <div className={VISIBILITY_STYLES[role]}>{children}</div>;
}
