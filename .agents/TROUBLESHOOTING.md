# Troubleshooting & Common Issues

## 🚨 React Native Reanimated: `installTurboModule` crash

If you encounter an error like this on Android (Expo Go):
```text
Exception in HostFunction: TurboModule method "installTurboModule" called with 1 arguments (expected argument count: 0)
```
This is caused by a missing or incorrect peer dependency for `react-native-reanimated` v4.

**Why it happens:**
Reanimated v4 relies on `react-native-worklets` to handle TurboModules. If `package-lock.json` is deleted and `npm install` is run, npm might drop or incorrectly resolve transitive dependencies, leading to the absence of the correct `react-native-worklets` package.

**How to fix it:**
1. Explicitly install the peer dependency using Expo:
   ```bash
   npx expo install react-native-worklets
   ```
2. Clear Metro bundler cache:
   ```bash
   npx expo start -c
   ```
3. Restart your Expo Go client and clear its app data/cache if the error persists.

## ⚠️ Important rule regarding `package-lock.json`
**Never delete `package-lock.json`** unless absolutely necessary. Doing so forces npm to completely re-resolve the dependency tree, which frequently breaks peer dependencies in the React Native / Expo ecosystem. If you need to clean your project, only delete `node_modules` and run `npm install`.

## 🚨 Nesting Lists Error: `VirtualizedLists should never be nested inside plain ScrollViews...`

If you get a warning/crash stating that a `VirtualizedList` (like `FlatList`, `SectionList`, `FlashList`) is nested inside a parent `ScrollView` with the same orientation:

**Why it happens:**
React Native needs to manage memory by "windowing" (only rendering items currently on screen). Nesting lists inside scroll views breaks this since the child list expands to render all items at once, causing performance degradation and list-rendering glitches.

**How to fix it:**
1. **Refactor the Layout**: Extract the parent `ScrollView`. If you need a scrollable header, use the list's `ListHeaderComponent` property instead.
2. **Conditional Rendering in Multi-step Layouts**: If building a wizard (like `NewLoanWizard.tsx`) where some steps use a list (Step 1) and others use a standard form (Steps 2 and 3), do NOT wrap the entire wizard container in a `ScrollView`. Instead:
   - Make the wizard wrapper a standard `<View className="flex-1">`.
   - In Step 1, render the `FlatList` directly inside a simple `<View>` wrapper.
   - Wrap *only* the specific steps (e.g., Step 2, Step 3) in local `<ScrollView>` elements.
3. **Never wrap the root container in a ScrollView** if any of its possible children contain a `FlatList` or dynamic tables.
