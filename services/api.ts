import axios from 'axios';
import { ENV } from '../config/env';
import { secureStorage } from '../lib/secureStorage';

export const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

type LogoutCallback = () => void;
let onLogoutCallback: LogoutCallback | null = null;

export const setLogoutCallback = (callback: LogoutCallback) => {
  onLogoutCallback = callback;
};

api.interceptors.request.use(
  async (config) => {
    const token = await secureStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn("[API] 401 Unauthorized — sesión expirada o inválida");
      if (onLogoutCallback) onLogoutCallback();
    }
    if (status === 403) {
      console.warn("[API] 403 Forbidden — sin permisos para este recurso");
    }
    return Promise.reject(error);
  }
);

/**
 * Extrae el mensaje legible de un error de la API (NestJS devuelve
 * `message` como string o array de strings en el body de la respuesta).
 */
export function getApiErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
    if (message) return message;
  }
  return fallback;
}
