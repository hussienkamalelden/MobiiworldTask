export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];

export const FONT_SIZES = ["sm", "md", "lg"] as const;
export type FontSize = (typeof FONT_SIZES)[number];

export const DEFAULT_THEME: Theme = "system";
export const DEFAULT_FONT_SIZE: FontSize = "md";

export const THEME_STORAGE_KEY = "theme";
export const FONT_SIZE_STORAGE_KEY = "font-size";

export const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

export const PREFERENCES_SCRIPT = `(() => {
  try {
    const root = document.documentElement;
    const theme = localStorage.getItem("${THEME_STORAGE_KEY}");
    const fontSize = localStorage.getItem("${FONT_SIZE_STORAGE_KEY}");
    const prefersDark = window.matchMedia("${DARK_MODE_QUERY}").matches;
    root.classList.toggle("dark", theme === "dark" || (theme !== "light" && prefersDark));
    if (fontSize === "sm" || fontSize === "lg") root.dataset.fontSize = fontSize;
  } catch {}
})();`;
