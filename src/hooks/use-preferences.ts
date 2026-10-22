"use client";

import { useSyncExternalStore } from "react";
import {
  DARK_MODE_QUERY,
  DEFAULT_FONT_SIZE,
  DEFAULT_ROLE,
  DEFAULT_THEME,
  FONT_SIZES,
  FONT_SIZE_STORAGE_KEY,
  ROLES,
  ROLE_STORAGE_KEY,
  THEMES,
  THEME_STORAGE_KEY,
} from "@/lib/preferences";
import type { FontSize, Role, Theme } from "@/lib/preferences";

const listeners = new Set<() => void>();

function readPreference<T extends string>(
  key: string,
  options: ReadonlyArray<T>,
  fallback: T,
): T {
  try {
    const stored = localStorage.getItem(key);
    return options.find((option) => option === stored) ?? fallback;
  } catch {
    return fallback;
  }
}

function writePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function getTheme(): Theme {
  return readPreference(THEME_STORAGE_KEY, THEMES, DEFAULT_THEME);
}

function getFontSize(): FontSize {
  return readPreference(FONT_SIZE_STORAGE_KEY, FONT_SIZES, DEFAULT_FONT_SIZE);
}

function getRole(): Role {
  return readPreference(ROLE_STORAGE_KEY, ROLES, DEFAULT_ROLE);
}

function applyPreferences() {
  const root = document.documentElement;
  const theme = getTheme();
  const fontSize = getFontSize();
  const prefersDark = window.matchMedia(DARK_MODE_QUERY).matches;

  root.classList.toggle("dark", theme === "dark" || (theme === "system" && prefersDark));
  root.dataset.role = getRole();

  if (fontSize === DEFAULT_FONT_SIZE) {
    delete root.dataset.fontSize;
  } else {
    root.dataset.fontSize = fontSize;
  }
}

function notify() {
  applyPreferences();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  applyPreferences();
  listeners.add(listener);
  const media = window.matchMedia(DARK_MODE_QUERY);
  media.addEventListener("change", notify);
  window.addEventListener("storage", notify);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", notify);
    window.removeEventListener("storage", notify);
  };
}

function setTheme(theme: Theme) {
  writePreference(THEME_STORAGE_KEY, theme);
  notify();
}

function setFontSize(fontSize: FontSize) {
  writePreference(FONT_SIZE_STORAGE_KEY, fontSize);
  notify();
}

export function setRole(role: Role) {
  writePreference(ROLE_STORAGE_KEY, role);
  notify();
}

export function usePreferences() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => DEFAULT_THEME);
  const fontSize = useSyncExternalStore(subscribe, getFontSize, () => DEFAULT_FONT_SIZE);
  const role = useSyncExternalStore(subscribe, getRole, () => DEFAULT_ROLE);

  return { theme, fontSize, role, setTheme, setFontSize, setRole };
}
