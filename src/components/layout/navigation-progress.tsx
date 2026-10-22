"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { subscribeToNavigationStart } from "@/lib/navigation-progress";

type ProgressState = "idle" | "loading" | "complete";

const COMPLETE_DURATION_MS = 400;
const MAX_LOADING_MS = 15000;

const STATE_STYLES: Record<ProgressState, string> = {
  idle: "w-0 opacity-0 transition-none",
  loading: "w-4/5 opacity-100 transition-[width] duration-[8000ms] ease-out",
  complete:
    "w-full opacity-0 [transition:width_200ms_ease-out,opacity_200ms_ease-out_200ms]",
};

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = `${pathname}?${searchParams.toString()}`;

  const [state, setState] = useState<ProgressState>("idle");
  const [previousLocation, setPreviousLocation] = useState(location);

  if (location !== previousLocation) {
    setPreviousLocation(location);
    if (state === "loading") {
      setState("complete");
    }
  }

  useEffect(() => subscribeToNavigationStart(() => setState("loading")), []);

  useEffect(() => {
    if (state === "idle") return;

    const timeout = window.setTimeout(
      () => setState(state === "loading" ? "complete" : "idle"),
      state === "loading" ? MAX_LOADING_MS : COMPLETE_DURATION_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [state]);

  return (
    <div
      role={state === "loading" ? "progressbar" : undefined}
      aria-label={state === "loading" ? "Loading page" : undefined}
      aria-hidden={state === "loading" ? undefined : true}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
    >
      <div
        className={`h-full rounded-r-full bg-accent-fg shadow-[0_0_8px_var(--accent-fg)] ${STATE_STYLES[state]}`}
      />
    </div>
  );
}
