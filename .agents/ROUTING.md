# Routing & Navigation Context

## 🗺️ Expo Router Structure

This app uses File-Based Routing via **Expo Router v3+**.

### Key Concepts:
1. **The `app/` Directory**: All screens live here. The folder structure dictates the URL structure.
2. **Route Groups `(folderName)`**: Folders wrapped in parentheses (like `(auth)` or `(app)`) are used to group routes logically and apply shared layouts, but they **do not affect the URL route**. 
   - Example: `app/(auth)/login.tsx` is accessed via `router.push('/login')`.
3. **Layouts `_layout.tsx`**: These files wrap all screens in their folder. They define the navigator type (Stack, Tabs) and shared UI.

### App Structure:
- `app/_layout.tsx`: The root layout. **Always** contains the `QueryClientProvider` and the `PortalHost` (which must be at the very end of the tree for modals/dropdowns to render on top).
- `app/(auth)/`: Unauthenticated screens (login). Uses a standard `Stack`.
- `app/(app)/`: Authenticated screens.
- `app/(app)/(tabs)/`: The main bottom navigation tabs. Shared chrome (header, tab bar) lives in `app/(app)/(tabs)/_layout.tsx`.

## 📱 Bottom Tab Bar (`app/(app)/(tabs)/_layout.tsx`)

The authenticated app uses five tabs: **Inicio**, **Clientes**, **Nuevo**, **Cobros**, **Resumen**.

### Header (shared across tabs)
- **Left:** App logo + "PrestamosYA" title (`text-secondary dark:text-primary`).
- **Right:** Dark/light toggle (`useColorScheme` from `nativewind`) + user avatar.
- Header background/border colors come from `getThemeColors(colorScheme)` in `@/lib/theme`.

### Tab bar styling
- Active/inactive tint colors: `getThemeColors()` → `tabActive` / `tabInactive`.
  - **Light mode:** active tab = azul (`secondary`); **dark mode:** active tab = celeste (`primary`).
- Safe area: always use `useSafeAreaInsets()` for `paddingBottom` / `height` — never hardcode bottom padding.
- Tab bar background/border: `colors.background` and `colors.border` from `@/lib/theme`.

### Center FAB tab — "Nuevo" (`name="new"`)
The middle tab is a **floating action button** style icon, visually elevated above the other four tabs:
- Circle: `48×48`, `marginBottom: 24` (keeps icon raised; label stays aligned via `tabBarLabelStyle.marginTop`).
- Fill: `palette.verde` (green accent).
- Plus icon: `palette.celeste` (always green circle + celeste plus, regardless of active state).
- **Do not** move the "Nuevo" label upward — only the icon is elevated.

When adding new tabs or changing the FAB, keep brand colors from `@/lib/theme` — never hardcode hex values.

## 📱 Safe Areas & Viewports

**CRITICAL RULE**: Do not use hardcoded paddings to avoid the system navigation bar (Android buttons) or iOS home indicator. Modern devices draw edge-to-edge.

**How to handle safe areas:**
Use the `useSafeAreaInsets` hook from `react-native-safe-area-context`.

Example for custom tab bars or sticky footers:
```tsx
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomFooter() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ paddingBottom: insets.bottom, height: 60 + insets.bottom }}>
       {/* Content */}
    </View>
  );
}
```
