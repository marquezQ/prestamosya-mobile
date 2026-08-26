# Stack & Configuration Context

## 📦 Core Dependencies

We are using a bleeding-edge modern React Native stack. **Strict version adherence is required**.

- `expo`: ~54.0.35 (React Native 0.81.5)
- `nativewind`: 4.2.1
- `expo-router`: Compatible with Expo 54
- `@tanstack/react-query`: ^5.101.2
- `zustand`: ^5.0.14
- `react-hook-form`: ^7.81.0
- `zod`: ^4.4.3
- `axios`: ^1.18.1
- `@rn-primitives/*`: Core logic for UI components
- `lucide-react-native`: For iconography
- `react-native-webview` (~14.x): Renders OpenStreetMap maps inside a WebView using Leaflet.js (free, no API key). **Works in Expo Go** and production builds. The thin wrapper `components/ui/AppMapView(.web).tsx` handles the HTML generation and bidirectional communication (`postMessage` / `injectJavaScript`). Central constants (`DEFAULT_MAP_COORDS`, `roundCoord`) live in `lib/maps/config.ts`; the Leaflet HTML template lives in `lib/maps/mapHTML.ts`.
- `expo-location` (~19.x): Native location — foreground permissions, GPS position, reverse geocoding. Installed via `npx expo install expo-location`. Config plugin in `app.json` sets the permission message (Spanish). Bundled in Expo Go.
- `expo-image-picker` (~17.x): Media library access for guarantee photos. Installed via `npx expo install expo-image-picker`. Config plugin in `app.json` sets the Spanish `photoPermission` message. Gallery-only (no camera). Bundled in Expo Go; works on web too (file input fallback), so no `.web.tsx` split needed.
- `react-native-keyboard-controller` (1.18.5): Modern keyboard handling (smooth, native-feeling scroll-to-focused-input). **Bundled in Expo Go since SDK 54** (`inExpoGo: true`). **Does NOT support web** — see Platform Extensions below.
- `date-fns`: Date formatting utility. Used for displaying human-readable dates in Spanish locale (`date-fns/locale/es`).

## 🌐 Web Platform Extensions (`.web.tsx`)

**CRITICAL RULE**: Libraries that use native modules (like `react-native-camera`, etc.) will crash the web bundler with an `Importing native-only module` error.

**Pattern**: Create a sibling file with the `.web.tsx` extension as a fallback. Metro bundler automatically uses the `.web.tsx` version when bundling for web, and the `.tsx` version on iOS/Android.

Example:
```
components/client-detail/ClientAddressMap.tsx       ← used on iOS & Android (real MapView)
components/client-detail/ClientAddressMap.web.tsx   ← used on Web (placeholder UI)
```

For libraries consumed across many screens (e.g. `react-native-keyboard-controller`), create a **thin wrapper in `components/ui/`** and have screens import from the wrapper, never the library directly:
```
components/ui/KeyboardAwareScrollView.tsx       ← native (re-exports the library)
components/ui/KeyboardAwareScrollView.web.tsx   ← web (plain RN ScrollView)
components/ui/KeyboardProvider.tsx              ← native (re-exports KeyboardProvider)
components/ui/KeyboardProvider.web.tsx          ← web (renders children as-is)
```

Do NOT use `Platform.OS === 'web'` conditional inside a single file to guard native imports — the import itself will still be parsed and crash. Always use separate `.web.tsx` files.

## ⚙️ Key Configuration Files

- `package.json`: Entry point is `"main": "expo-router/entry"`.
- `app.json`: Uses `"scheme": "prestamosya"` for deep linking and enables `"typedRoutes": true` under experiments. `"edgeToEdgeEnabled": true` (default in SDK 54; forced on Android 15+). Plugins: `expo-router`, `expo-secure-store`, and `expo-location` (configures the location permission message).
- `tsconfig.json`: Defines the `@/*` path alias → `./*`. **Do not use `baseUrl`** (deprecated in TypeScript 6.0+); paths must use explicit relative prefixes (e.g. `"./*"`).
- `.env` & `.env.example`: Environment variables (e.g., `EXPO_PUBLIC_API_URL`). The `.env` file is gitignored. Always use the `EXPO_PUBLIC_` prefix so Expo can inject them into the client bundle.
- `global.css`: Brand CSS variables (`--brand-*`) and semantic theme tokens for NativeWind/RNR.
- `lib/theme/`: JS mirror of the theme for imperative APIs (React Navigation, Lucide `color`, `tabBarStyle`). See `.agents/UI_AND_STYLES.md`.
- `metro.config.js`: Wrapped with `withNativeWind` for Tailwind support.
- `babel.config.js`: Contains `babel-preset-expo`.
- `tailwind.config.js`: Maps CSS variables (from `global.css`) to Tailwind semantics (`background`, `primary`, `brand-celeste`, etc.). Includes `tailwindcss-animate`.
- `components.json`: Configuration for the `@react-native-reusables/cli`. Tells the CLI where to drop new components (always in `components/ui`).
- `lib/format.ts`: Shared formatting utilities (`formatBs`, `formatDateBO`, `getInitials`, `getTodayISO`). Single source of truth for money/date display across ALL modules — do not duplicate these helpers locally or inline.
- `app/_layout.tsx`: Mounts `QueryClientProvider`, `KeyboardProvider`, auth hydration and route protection. The `<PortalHost />` lives INSIDE `ThemeProvider` (see UI_AND_STYLES.md). The Reanimated logger is configured ONLY under `__DEV__` (silences strict-mode warnings caused by `@rn-primitives` primitives; never runs in production builds).
