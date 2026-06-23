export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

export function getStoredTheme(): Theme | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (!v) return null;
    if (v === "light" || v === "dark" || v === "system") return v;
    return null;
  } catch {
    return null;
  }
}

function isSystemDark() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  let dark = false;

  if (theme === "system") {
    dark = isSystemDark();
  } else {
    dark = theme === "dark";
  }

  if (dark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  applyTheme(theme);
}

export function initTheme() {
  const stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
    return;
  }

  // default follow system
  applyTheme("system");
}
