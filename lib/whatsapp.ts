import { Linking, Alert, Platform } from 'react-native';

export interface WhatsAppOptions {
  phone: string;
  text?: string;
}

/**
 * Formatea el número de teléfono asegurando el código de país (591 para Bolivia si son 8 dígitos).
 */
export function formatWhatsAppPhone(phone: string): string {
  let clean = phone ? phone.replace(/[^0-9]/g, '') : '';
  if (!clean) return '';
  if (clean.length === 8) {
    clean = `591${clean}`;
  }
  return clean;
}

/**
 * Abre directamente WhatsApp usando la intent/scheme nativa whatsapp://
 * En Android e iOS esto hace que el sistema operativo muestre la ventana nativa
 * de selección ("Completar acción con: WhatsApp / WhatsApp Business") si hay más de una app instalada.
 */
export async function openWhatsApp({ phone, text = '' }: WhatsAppOptions): Promise<void> {
  const cleanPhone = formatWhatsAppPhone(phone);
  if (!cleanPhone) {
    const msg = 'El cliente no tiene un número de teléfono válido registrado.';
    if (Platform.OS === 'web') window.alert(msg);
    else Alert.alert('Sin Teléfono', msg);
    return;
  }

  const encodedText = encodeURIComponent(text);
  const textParam = encodedText ? `&text=${encodedText}` : '';

  // whatsapp://send es el URI scheme nativo registrado por WhatsApp y WhatsApp Business.
  // Al abrir este esquema, el sistema operativo (Android/iOS) despliega la ventana nativa de selección.
  const nativeUrl = `whatsapp://send?phone=${cleanPhone}${textParam}`;
  const webUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}${textParam}`;

  try {
    const canOpenNative = await Linking.canOpenURL(nativeUrl);
    if (canOpenNative) {
      await Linking.openURL(nativeUrl);
    } else {
      await Linking.openURL(webUrl);
    }
  } catch {
    try {
      await Linking.openURL(webUrl);
    } catch {
      const msg = 'No se pudo abrir WhatsApp. Verifica que la aplicación esté instalada.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Error', msg);
    }
  }
}

/**
 * Alias de compatibilidad para gatillar la selección nativa de WhatsApp.
 * Directamente invoca el selector del sistema operativo sin mostrar diálogos adicionales.
 */
export function sendWhatsAppWithChooser(options: WhatsAppOptions): void {
  openWhatsApp(options);
}
