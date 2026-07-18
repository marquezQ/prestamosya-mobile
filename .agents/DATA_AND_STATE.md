# Data & State Context

## 🔄 Server State: TanStack React Query

All server data fetching, caching, and mutations MUST be handled by **React Query**. Do not use `useEffect` + `useState` to fetch data.

- The `QueryClientProvider` is configured in `app/_layout.tsx` with a default `staleTime` of 5 minutes.
- For queries (GET), use `useQuery`.
- For mutations (POST, PUT, DELETE), use `useMutation` and `queryClient.invalidateQueries` to refresh the UI.

## 🌐 Axios Instance

All HTTP requests must go through the centralized Axios instance located at `services/api.ts`.
- It automatically uses the `EXPO_PUBLIC_API_URL` environment variable.
- It has request interceptors ready to attach Auth tokens (pending storage definition, PED-8).
- It has response interceptors to handle `401 Unauthorized` and `403 Forbidden` errors globally.

## 🧠 Client State: Zustand

Global client state (e.g., current selected theme, UI toggles, non-persistent user preferences) is managed by **Zustand**.

- Stores should be created in the `stores/` directory.
- Barrel export them from `stores/index.ts`.
- **CRITICAL**: Do NOT use `persist` middleware (like `createJSONStorage`) until the project explicitly defines a secure storage mechanism (like MMKV or SecureStore). This is tracked in tickets PED-8 and PED-13. Currently, all stores must be **in-memory only**.

**Rule of Thumb**:
- Does it come from the database? -> React Query.
- Is it a local UI toggle or temporary client state? -> Zustand.
