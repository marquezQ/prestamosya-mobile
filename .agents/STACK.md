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

## ⚙️ Key Configuration Files

- `package.json`: Entry point is `"main": "expo-router/entry"`.
- `app.json`: Uses `"scheme": "prestamosya"` for deep linking and enables `"typedRoutes": true` under experiments.
- `tsconfig.json`: Defines the `@/*` alias mapping to `./*`.
- `metro.config.js`: Wrapped with `withNativeWind` for Tailwind support.
- `babel.config.js`: Contains `babel-preset-expo`.
- `tailwind.config.js`: Maps CSS variables (from `global.css`) to Tailwind color semantics (e.g., `background`, `primary`, `destructive`). Includes `tailwindcss-animate`.
- `components.json`: Configuration for the `@react-native-reusables/cli`. Tells the CLI where to drop new components (always in `components/ui`).
