/**
 * Paleta PrestamosYA — valores hex para APIs imperativas
 * (React Navigation, Lucide `color`, tabBarStyle, etc.).
 *
 * Los tokens semánticos de Tailwind/NativeWind viven en `global.css`.
 * Si cambias un color de marca aquí, actualiza también las variables HSL en global.css.
 */
export const palette = {
  celeste: "#6DB6EF",
  azul: "#2368A3",
  verde: "#C5DB70",
  blanco: "#FDFDFB",
} as const;

export type ColorScheme = "light" | "dark";

/**
 * Tokens semánticos por modo. Equivalente JS de las variables CSS en global.css.
 * Usar `getThemeColors()` en lugar de leer este objeto directamente.
 */
export const themeColors = {
  light: {
    background: palette.blanco,
    foreground: "#09090b",
    card: "#ffffff",
    primary: palette.celeste,
    secondary: palette.azul,
    accent: palette.verde,
    muted: "#f4f4f5",
    mutedForeground: "#71717a",
    border: "#e4e4e7",
    /** Tab/header activo en modo claro: azul alternativo */
    tabActive: palette.azul,
    tabInactive: "#71717a",
    headerBrand: palette.azul,
  },
  dark: {
    background: "#09090b",
    foreground: "#fafafa",
    card: "#09090b",
    primary: palette.celeste,
    secondary: palette.azul,
    accent: palette.verde,
    muted: "#27272a",
    mutedForeground: "#a1a1aa",
    border: "#27272a",
    /** Tab/header activo en modo oscuro: celeste primario */
    tabActive: palette.celeste,
    tabInactive: "#a1a1aa",
    headerBrand: palette.celeste,
  },
} as const;

export type ThemeColors = (typeof themeColors)[ColorScheme];

export function getThemeColors(
  scheme: ColorScheme | null | undefined
): ThemeColors {
  return themeColors[scheme === "dark" ? "dark" : "light"];
}
