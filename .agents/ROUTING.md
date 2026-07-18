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
- `app/(app)/(tabs)/`: The main bottom navigation tabs.

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
