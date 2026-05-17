"use client";

import { useTheme as useThemeBase, type ThemeContextValue } from "@wrksz/themes/client";

export type AppTheme = "light" | "dark" | "system" | "light-brown";

export function useTheme(): ThemeContextValue<AppTheme> {
  return useThemeBase<AppTheme>();
}
