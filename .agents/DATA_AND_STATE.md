# Data & State Context

## 🔄 Server State: TanStack React Query

All server data fetching, caching, and mutations MUST be handled by **React Query**. Do not use `useEffect` + `useState` to fetch data.

- The `QueryClientProvider` is configured in `app/_layout.tsx` with a default `staleTime` of 5 minutes.
- For queries (GET), use `useQuery`.
- For mutations (POST, PUT, DELETE), use `useMutation` and `queryClient.invalidateQueries` to refresh the UI.

## 🌐 Axios Instance

All HTTP requests must go through the centralized Axios instance located at `services/api.ts`.
- It automatically uses the `EXPO_PUBLIC_API_URL` environment variable.
- It has request interceptors ready to attach Auth tokens automatically by reading them from `lib/secureStorage.ts`.
- It has response interceptors to handle `401 Unauthorized` globally. To avoid circular dependencies with Zustand (`authStore.ts`), it uses a Dependency Inversion pattern with a `setLogoutCallback` which is triggered upon receiving a 401.

## 🔐 Secure Storage & Auth

All authentication tokens MUST be saved securely using `expo-secure-store`.
- The single source of truth for interacting with SecureStore is `lib/secureStorage.ts`.
- This file includes a fallback for `Platform.OS === 'web'` using `localStorage` to prevent errors during browser development.

## 🧠 Client State: Zustand

Global client state (e.g., current selected theme, UI toggles, non-persistent user preferences) is managed by **Zustand**.

- Stores should be created in the `stores/` directory.
- Barrel export them from `stores/index.ts` if needed.
- **CRITICAL**: Do NOT use `persist` middleware (like `createJSONStorage`) to persist secure tokens. Tokens live strictly in `lib/secureStorage.ts`.
- For the authentication state (`authStore.ts`), the store should maintain ephemeral state (`user`, `isAuthenticated`, `isHydrated`). When the app loads, `hydrate()` is called to fetch the token from `secureStorage`, fetching the user profile if the token exists, and updating the state accordingly.

**Rule of Thumb**:
- Does it come from the database? -> React Query.
- Is it a local UI toggle or temporary client state? -> Zustand.
