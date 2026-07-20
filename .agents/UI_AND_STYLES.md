# UI & Styling Context

## 🎨 NativeWind v4 & Tailwind CSS

This project uses **NativeWind v4**. This means we write React Native styling using Tailwind CSS utility classes via the `className` prop.

**CRITICAL RULE: Always use `className` instead of inline `style={{...}}`.**
*Exception*: You CANNOT use `className` inside Expo Router configuration objects (like `screenOptions`, `tabBarStyle`, `headerStyle`). Those require standard React Native style objects or hex colors because they are not React components being processed by NativeWind. However, if an option accepts a React Component (e.g., `headerTitle: () => <View className="..." />`), you CAN and SHOULD use `className` inside that component.

## 🧩 React Native Reusables (RNR)

We do not write generic UI components (Buttons, Modals, Dropdowns) from scratch. We use React Native Reusables (similar to shadcn/ui).

- Components are located in `components/ui/`.
- **They are source code, not node_modules**. You can and should modify them if a specific design change is needed globally.
- They rely on `@rn-primitives/*` for accessibility and behavior, and NativeWind for styling.
- To add a new component (e.g., Toast, Input), use the CLI: `npx @react-native-reusables/cli@latest add [component]`

## 🌗 Theme & Colors

### Colores Pivote (PrestamosYA)
Se han definido los siguientes colores base (pivotes) para el proyecto:
- **Verde secundario:** `#C5DB70`
- **Celeste:** `#6DB6EF`
- **Azul:** `#2368A3`
- **Blanco:** `#FDFDFB`

> **Nota:** Aún queda por definir cuál será el color primario definitivo (si el celeste o el azul) y se debe considerar el soporte para modo claro y oscuro más adelante. Por esto, la regla es que **estos colores deben declararse en un archivo CSS base (como `global.css`)** y usarse a través de variables o clases semánticas en toda la app. De esta forma, si el día de mañana se cambia un color o se ajusta el tema, solo se modifica el CSS.

Do not hardcode colors like `className="bg-blue-500"` for core UI.
We use semantic CSS variables defined in `global.css` and mapped in `tailwind.config.js`.

Use semantic classes:
- `bg-background` (App background)
- `bg-card` (Cards and panels)
- `text-foreground` (Main text)
- `text-muted-foreground` (Secondary/gray text)
- `bg-primary` (Main brand color for buttons, etc)
- `text-primary-foreground` (Text inside a primary button)

## 🪟 The PortalHost

Components like `Dialog`, `Select`, and `DropdownMenu` require a `<PortalHost />` to render over native elements.
**The `<PortalHost />` is already mounted at the very bottom of `app/_layout.tsx`. Do not move it or mount duplicates.**
