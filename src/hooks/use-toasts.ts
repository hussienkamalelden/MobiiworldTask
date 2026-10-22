"use client";

import { useSyncExternalStore } from "react";

export type ToastTone = "success" | "error";

export interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

const TOAST_DURATION_MS = 6000;
const EMPTY_TOASTS: Toast[] = [];

let toasts: Toast[] = EMPTY_TOASTS;
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function dismissToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function showToast(toast: Omit<Toast, "id">) {
  const id = nextId++;
  toasts = [...toasts, { ...toast, id }];
  emit();
  window.setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
}

export function useToasts(): Toast[] {
  return useSyncExternalStore(
    subscribe,
    () => toasts,
    () => EMPTY_TOASTS,
  );
}
