"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import { setRole } from "@/hooks/use-preferences";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface AdminAccessRequiredProps {
  description: string;
}

export function AdminAccessRequired({ description }: AdminAccessRequiredProps) {
  return (
    <EmptyState
      icon={ShieldAlert}
      headingLevel="h1"
      title="Admin access required"
      description={description}
      action={
        <Button onClick={() => setRole("admin")}>
          <ShieldCheck className="h-4 w-4" />
          Switch to Admin
        </Button>
      }
    />
  );
}
