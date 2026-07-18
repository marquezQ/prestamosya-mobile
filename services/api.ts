import axios from "axios";

/**
 * Axios instance centralizada para todos los requests a la API de PrestamosYA.
 *
 * baseURL se configura via variable de entorno EXPO_PUBLIC_API_URL,
 * que Expo expone automáticamente en tiempo de compilación.
 */
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// TODO (PED-8 / PED-13): Reemplazar este placeholder con la lectura real del
// token una vez que se defina el mecanismo de storage (MMKV, SecureStore, etc.)
api.interceptors.request.use(
  (config) => {
    // const token = getToken(); // ← implementar cuando storage esté definido
    const token: string | null = null; // placeholder

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ───────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // TODO: disparar logout / limpiar sesión cuando auth store esté definido
      console.warn("[API] 401 Unauthorized — sesión expirada o inválida");
    }

    if (status === 403) {
      console.warn("[API] 403 Forbidden — sin permisos para este recurso");
    }

    return Promise.reject(error);
  },
);
