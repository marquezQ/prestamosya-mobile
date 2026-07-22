import {
  DarkTheme,
  DefaultTheme,
  type Theme,
} from "@react-navigation/native";

import { type ColorScheme, getThemeColors } from "./colors";

export function getNavigationTheme(
  scheme: ColorScheme | null | undefined
): Theme {
  const colors = getThemeColors(scheme);
  const base = scheme === "dark" ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: scheme === "dark",
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.foreground,
      border: colors.border,
      notification: colors.primary,
    },
  };
}
