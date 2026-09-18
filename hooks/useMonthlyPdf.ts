import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { secureStorage } from '@/lib/secureStorage';
import { statsService } from '@/services/statsService';
import { getApiErrorMessage } from '@/services/api';

export function useMonthlyPdf() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAndOpenPdf = async (year?: number, month?: number) => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const token = await secureStorage.getToken();
      if (!token) {
        Alert.alert('Error de autenticación', 'No se encontró una sesión activa.');
        return;
      }

      const url = statsService.getMonthlyPdfUrl(year, month);
      const monthStr = month ? String(month).padStart(2, '0') : 'actual';
      const yearStr = year ? String(year) : 'actual';
      const fileName = `balance-pagos-${yearStr}-${monthStr}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      const downloadResult = await FileSystem.downloadAsync(url, fileUri, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/pdf',
        },
      });

      if (downloadResult.status === 200) {
        if (Platform.OS === 'android') {
          try {
            // Convierte el file:// URI a un content:// URI seguro para compartir con otras apps en Android
            const contentUri = await FileSystem.getContentUriAsync(downloadResult.uri);
            await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
              data: contentUri,
              flags: 1, // Intent.FLAG_GRANT_READ_URI_PERMISSION
              type: 'application/pdf',
            });
          } catch (intentError) {
            console.warn('[PDF] IntentLauncher falló, usando fallback de Sharing:', intentError);
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
              await Sharing.shareAsync(downloadResult.uri, {
                mimeType: 'application/pdf',
                UTI: 'com.adobe.pdf',
                dialogTitle: `Reporte Mensual ${monthStr}/${yearStr}`,
              });
            } else {
              Alert.alert(
                'Reporte descargado',
                `El PDF se guardó correctamente en: ${downloadResult.uri}`,
              );
            }
          }
        } else {
          // iOS o Web fallback
          const canShare = await Sharing.isAvailableAsync();
          if (canShare) {
            await Sharing.shareAsync(downloadResult.uri, {
              mimeType: 'application/pdf',
              UTI: 'com.adobe.pdf',
              dialogTitle: `Reporte Mensual ${monthStr}/${yearStr}`,
            });
          } else {
            Alert.alert(
              'Reporte descargado',
              `El PDF se guardó correctamente en: ${downloadResult.uri}`,
            );
          }
        }
      } else if (downloadResult.status === 401) {
        Alert.alert(
          'Sesión expirada',
          'Tu sesión ha expirado o no tienes permisos para acceder al reporte.',
        );
      } else {
        Alert.alert(
          'Error',
          `No se pudo descargar el reporte (Código de estado HTTP: ${downloadResult.status}).`,
        );
      }
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Ocurrió un error inesperado al descargar el reporte PDF.',
      );
      Alert.alert('Error de descarga', message);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadAndOpenPdf,
    isDownloading,
  };
}
