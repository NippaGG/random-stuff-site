"use client";

export type PhosphorTheme = "lime" | "amber" | "emerald" | "cobalt";
export type ThemeName = PhosphorTheme;

export interface ThemeConfig {
  id: PhosphorTheme;
  name: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  accentGlow: string;
  previewClass: string;
}

export const THEMES: Record<PhosphorTheme, ThemeConfig> = {
  lime: {
    id: "lime",
    name: "Lime Terminal",
    accent: "#a3e635",
    accentBg: "rgba(163, 230, 53, 0.12)",
    accentBorder: "rgba(163, 230, 53, 0.35)",
    accentGlow: "rgba(163, 230, 53, 0.2)",
    previewClass: "bg-[#a3e635]",
  },
  amber: {
    id: "amber",
    name: "Cyber Amber",
    accent: "#f59e0b",
    accentBg: "rgba(245, 158, 11, 0.12)",
    accentBorder: "rgba(245, 158, 11, 0.35)",
    accentGlow: "rgba(245, 158, 11, 0.2)",
    previewClass: "bg-[#f59e0b]",
  },
  emerald: {
    id: "emerald",
    name: "Matrix Emerald",
    accent: "#10b981",
    accentBg: "rgba(16, 185, 129, 0.12)",
    accentBorder: "rgba(16, 185, 129, 0.35)",
    accentGlow: "rgba(16, 185, 129, 0.2)",
    previewClass: "bg-[#10b981]",
  },
  cobalt: {
    id: "cobalt",
    name: "Cobalt Laser",
    accent: "#38bdf8",
    accentBg: "rgba(56, 189, 248, 0.12)",
    accentBorder: "rgba(56, 189, 248, 0.35)",
    accentGlow: "rgba(56, 189, 248, 0.2)",
    previewClass: "bg-[#38bdf8]",
  },
};

const THEME_STORAGE_KEY = "random-stuff-theme";
const CRT_STORAGE_KEY = "random-stuff-crt";

export function getStoredTheme(): PhosphorTheme {
  if (typeof window === "undefined") return "lime";
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && stored in THEMES) {
      return stored as PhosphorTheme;
    }
  } catch {
    // fallback
  }
  return "lime";
}

export function applyTheme(theme: PhosphorTheme) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme;
    const config = THEMES[theme];
    document.documentElement.style.setProperty("--theme-accent", config.accent);
    document.documentElement.style.setProperty("--theme-accent-bg", config.accentBg);
    document.documentElement.style.setProperty("--theme-accent-border", config.accentBorder);
    document.documentElement.style.setProperty("--theme-accent-glow", config.accentGlow);
    document.documentElement.style.setProperty("--cursor-color", config.accent);

    window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme } }));
  } catch {
    // ignore
  }
}

export function isCrtEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CRT_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setCrtEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CRT_STORAGE_KEY, enabled ? "true" : "false");
    document.documentElement.dataset.crt = enabled ? "true" : "false";
    window.dispatchEvent(new CustomEvent("crt-change", { detail: { enabled } }));
  } catch {
    // ignore
  }
}

export function toggleCrt(): boolean {
  const current = isCrtEnabled();
  const next = !current;
  setCrtEnabled(next);
  return next;
}
