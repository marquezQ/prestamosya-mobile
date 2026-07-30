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
