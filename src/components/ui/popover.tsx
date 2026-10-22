"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

interface PopoverProps {
  buttonLabel: string;
  buttonContent: ReactNode;
  buttonClassName: string;
  panelLabel: string;
  panelClassName?: string;
  children: (close: () => void) => ReactNode;
}

export function Popover({
  buttonLabel,
  buttonContent,
  buttonClassName,
  panelLabel,
  panelClassName = "w-64",
  children,
}: PopoverProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    setFocusRequest((current) => current + 1);
  }

  useEffect(() => {
    if (focusRequest > 0) {
      buttonRef.current?.focus();
    }
  }, [focusRequest]);

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
        setFocusRequest((current) => current + 1);
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
        aria-label={buttonLabel}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={buttonClassName}
      >
        {buttonContent}
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={panelLabel}
          className={`animate-fade-in absolute top-full right-0 z-50 mt-2 rounded-2xl border border-line bg-surface p-4 shadow-xl shadow-black/5 ${panelClassName}`}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}
