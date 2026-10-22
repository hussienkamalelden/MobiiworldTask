export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];

export const FONT_SIZES = ["sm", "md", "lg"] as const;
export type FontSize = (typeof FONT_SIZES)[number];

export const ROLES = ["admin", "user"] as const;
export type Role = (typeof ROLES)[number];

export const DEFAULT_THEME: Theme = "system";
export const DEFAULT_FONT_SIZE: FontSize = "md";
export const DEFAULT_ROLE: Role = "admin";

export const THEME_STORAGE_KEY = "theme";
export const FONT_SIZE_STORAGE_KEY = "font-size";
export const ROLE_STORAGE_KEY = "role";

export const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

export const PREFERENCES_SCRIPT = `(() => {
  const root = document.documentElement;
  root.dataset.role = "${DEFAULT_ROLE}";
  try {
    const theme = localStorage.getItem("${THEME_STORAGE_KEY}");
    const fontSize = localStorage.getItem("${FONT_SIZE_STORAGE_KEY}");
    const role = localStorage.getItem("${ROLE_STORAGE_KEY}");
    const prefersDark = window.matchMedia("${DARK_MODE_QUERY}").matches;
    root.classList.toggle("dark", theme === "dark" || (theme !== "light" && prefersDark));
    if (fontSize === "sm" || fontSize === "lg") root.dataset.fontSize = fontSize;
    if (role === "admin" || role === "user") root.dataset.role = role;
  } catch {}
})();`;
