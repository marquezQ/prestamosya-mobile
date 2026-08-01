# UI & Styling Context

## 🎨 NativeWind v4 & Tailwind CSS

This project uses **NativeWind v4**. This means we write React Native styling using Tailwind CSS utility classes via the `className` prop.

**CRITICAL RULE: Always use `className` instead of inline `style={{...}}`.**
*Exception*: You CANNOT use `className` inside Expo Router configuration objects (like `screenOptions`, `tabBarStyle`, `headerStyle`). Those require standard React Native style objects or hex colors because they are not React components being processed by NativeWind. However, if an option accepts a React Component (e.g., `headerTitle: () => <View className="..." />`), you CAN and SHOULD use `className` inside that component.

For imperative style APIs (React Navigation, Lucide `color` prop, etc.), import tokens from `@/lib/theme` instead of hardcoding hex values.

## 🧩 React Native Reusables (RNR)

We do not write generic UI components (Buttons, Modals, Dropdowns) from scratch. We use React Native Reusables (similar to shadcn/ui).

- Components are located in `components/ui/`.
- **They are source code, not node_modules**. You can and should modify them if a specific design change is needed globally.
- They rely on `@rn-primitives/*` for accessibility and behavior, and NativeWind for styling.
- To add a new component (e.g., Toast, Input), use the CLI: `npx @react-native-reusables/cli@latest add [component]`

## 🌗 Theme & Colors

### Arquitectura del tema (fuente única)

| Capa | Archivo | Uso |
|------|---------|-----|
| **CSS / Tailwind** | `global.css` | Variables `--brand-*` y tokens semánticos (`--primary`, `--accent`, etc.) |
| **Tailwind config** | `tailwind.config.js` | Mapea variables a clases (`bg-primary`, `text-secondary`, `bg-brand-verde`) |
| **JS imperativo** | `lib/theme/colors.ts` | Misma paleta en hex para React Navigation, iconos, `tabBarStyle` |
| **React Navigation** | `lib/theme/navigation.ts` | Tema de navegación derivado de los tokens |

> **Regla:** Para cambiar un color de marca en toda la app, edita `--brand-*` en `global.css` y el objeto `palette` en `lib/theme/colors.ts` (mantener ambos sincronizados).

### Colores Pivote (PrestamosYA)

| Marca | Hex | Token semántico | Clase Tailwind |
|-------|-----|-----------------|----------------|
| **Celeste** (primario) | `#6DB6EF` | `--primary` / `palette.celeste` | `bg-primary`, `text-primary`, `bg-brand-celeste` |
| **Azul** (alternativo) | `#2368A3` | `--secondary` / `palette.azul` | `bg-secondary`, `text-secondary`, `bg-brand-azul` |
| **Verde** (alternativo) | `#C5DB70` | `--accent` / `palette.verde` | `bg-accent`, `text-accent`, `bg-brand-verde` |
| **Blanco** | `#FDFDFB` | `--background` (modo claro) / `palette.blanco` | `bg-background`, `bg-brand-blanco` |

### Modo claro vs oscuro

- **Pantallas y componentes RNR:** usar clases semánticas con variante `dark:` (`bg-background`, `text-foreground`, `text-secondary dark:text-primary`).
- **Tabs / navegación:** usar `getThemeColors(colorScheme)` de `@/lib/theme`.
- **Toggle de tema:** `useColorScheme()` de `nativewind` + `ThemeProvider` en `app/_layout.tsx` con `getNavigationTheme()`.

**CRITICAL RULE for Text and RNR Components:**
When working inside complex RNR components (like `DropdownMenu`, `Dialog`, etc.), they use a `TextClassContext` to automatically pass adaptive semantic colors (like `--popover-foreground` or `--destructive`) to child text.
For this to work, you **must import `<Text>` from `@/components/ui/text`** instead of `react-native`. Using the default `react-native` Text component will ignore the context and texts might become invisible in Dark Mode.

Do not hardcode colors like `className="bg-blue-500"` or `color="#6DB6EF"` for core UI.

Use semantic classes:
- `bg-background` (App background)
- `bg-card` (Cards and panels)
- `text-foreground` (Main text)
- `text-muted-foreground` (Secondary/gray text)
- `bg-primary` (Celeste — main brand color)
- `bg-secondary` (Azul — alternative brand color)
- `bg-accent` (Verde — alternative brand color)
- `text-primary-foreground` (Text inside a primary button)

## 🪟 The PortalHost

Components like `Dialog`, `Select`, and `DropdownMenu` require a `<PortalHost />` to render over native elements.
**The `<PortalHost />` is already mounted at the very bottom of `app/_layout.tsx`. Do not move it or mount duplicates.**

---

## 🗂️ Client Detail Module — Components

All components for the client profile detail screen live in `components/client-detail/`.

| Component | Responsibility |
|---|---|
| `ClientDetailView.tsx` | Orchestrator. Renders a `ScrollView` with all sections. Injects mock data from `constants.ts`. |
| `ClientProfileHeader.tsx` | Large avatar, name, `CI: {idNumber}` (Carnet de Identidad), member-since date, Llamar + WhatsApp buttons. |
| `ActiveLoanCard.tsx` | Main active loan card with progress bar, next payment grid and "Registrar pago" CTA. |
| `LoanProgressBar.tsx` | Reusable horizontal progress bar (paid/total). |
| `ClientStatsRow.tsx` | Two stat cards side by side (Historial + Puntualidad). |
| `ClientAddressMap.tsx` | Native `MapView` (react-native-maps) with hardcoded fallback coords. |
| `ClientAddressMap.web.tsx` | Web fallback — no MapView, shows a placeholder. |
| `OtherActiveLoansSection.tsx` | List of secondary active loans (mocked). |
| `CompletedLoansSection.tsx` | List of completed loans with green checkmark badge. |
| `constants.ts` | All mock loan/stats data — replace with real props when backend is ready. |

### Icon Color Convention (Lucide)
- **Lucide icons inside NativeWind components**: prefer `className="text-*"` for color.
- **Lucide icons that need an explicit color (e.g., inside Buttons, or cross-platform)**: pass the `color` prop with a hex value from `palette` or a hardcoded utility color (e.g., `color="#22c55e"` for green-500, `color="#ffffff"` for white).
- This avoids dark mode rendering issues where `className` text color may not propagate correctly through the RNR `TextClassContext`.

### CI (Carnet de Identidad) Display Convention
- The field `client.idNumber` is the Bolivian ID card number (CI).
- Always display it as: `CI: {client.idNumber}` — never transform, slice, or build a synthetic ID from initials.
