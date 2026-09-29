/**
 * lib/pushNotifications.ts
 *
 * Helper centralizado para expo-notifications.
 * Encapsula el ciclo de vida del push token y los listeners de notificaciones.
 *
 * Patrón: similar a lib/whatsapp.ts — funciones puras exportadas,
 * sin acoplamiento a componentes ni stores.
 *
 * IMPORTANTE: Las funciones de este archivo solo funcionan en builds nativos
 * (APK / IPA). En Expo Go SDK 54, expo-notifications no está incluido.
 * No importar condicionalmente — el crash ocurre en build time si el módulo
 * no está disponible, no en runtime.
 */

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// ─── Configuración del handler de notificaciones ──────────────────────────────

/**
 * Configura cómo se presentan las notificaciones cuando la app está en primer plano
 * y configura el canal por defecto en Android (necesario para sonido y vibración).
 * Debe llamarse al inicio de la app en app/_layout.tsx.
 */
export async function configurePushNotifications(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notificaciones PrestamosYA',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#16a34a',
      sound: 'default',
    });
  }
}

// ─── Obtención del token ───────────────────────────────────────────────────────

/**
 * Solicita permisos de notificación al usuario y devuelve el Expo Push Token.
 *
 * @returns El token string (ExponentPushToken[...]) o null si:
 *  - El usuario denegó los permisos.
 *  - La plataforma es web (no aplica).
 *  - Ocurrió un error inesperado (se loggea en detalle para depuración).
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Las notificaciones push no aplican en web.
  if (Platform.OS === 'web') return null;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Solo pedimos el permiso si no está ya concedido.
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[PushNotifications] Permiso denegado por el usuario.');
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync(
        projectId && projectId !== 'your-eas-project-id' ? { projectId } : undefined
      );
      console.log('[PushNotifications] Push token de Expo obtenido exitosamente:', tokenData.data);
      return tokenData.data;
    } catch (expoError) {
      console.warn('[PushNotifications] getExpoPushTokenAsync falló, intentando token nativo del dispositivo (FCM):', expoError);
      
      // Fallback a token nativo del dispositivo (FCM)
      const nativeToken = await Notifications.getDevicePushTokenAsync();
      const tokenStr = typeof nativeToken.data === 'string' ? nativeToken.data : JSON.stringify(nativeToken.data);
      console.log('[PushNotifications] Push token nativo (FCM) obtenido exitosamente:', tokenStr);
      return tokenStr;
    }
  } catch (error) {
    console.error('[PushNotifications] Error crítico al obtener el push token:', error);
    return null;
  }
}

// ─── Listeners ─────────────────────────────────────────────────────────────────

export type NotificationReceivedHandler = (
  notification: Notifications.Notification
) => void;

export type NotificationResponseHandler = (
  response: Notifications.NotificationResponse
) => void;

export type PushTokenChangedHandler = (token: string) => void;

/**
 * Registra los listeners del ciclo de vida de notificaciones.
 * Devuelve una función de cleanup para removerlos al desmontar.
 *
 * - `onReceived`: la app está en primer plano y llega una notificación.
 * - `onResponse`: el usuario toca la notificación (app en bg/cerrada → primer plano).
 * - `onTokenChanged`: el token cambió — hay que re-registrarlo en el backend.
 */
export function setupNotificationListeners(handlers: {
  onReceived?: NotificationReceivedHandler;
  onResponse?: NotificationResponseHandler;
  onTokenChanged?: PushTokenChangedHandler;
}): () => void {
  const subscriptions: Notifications.Subscription[] = [];

  if (handlers.onReceived) {
    subscriptions.push(
      Notifications.addNotificationReceivedListener(handlers.onReceived)
    );
  }

  if (handlers.onResponse) {
    subscriptions.push(
      Notifications.addNotificationResponseReceivedListener(handlers.onResponse)
    );
  }

  if (handlers.onTokenChanged) {
    subscriptions.push(
      Notifications.addPushTokenListener(({ data }) => {
        if (handlers.onTokenChanged) handlers.onTokenChanged(data);
      })
    );
  }

  // Cleanup: remover todos los listeners al desmontar el componente que los registró.
  return () => {
    subscriptions.forEach((sub) => sub.remove());
  };
}
