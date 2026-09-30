# 🚀 Configuración de Notificaciones Push (Expo + Firebase + Backend)

Este documento detalla el paso a paso exacto que seguimos para lograr configurar exitosamente las notificaciones Push nativas en Android utilizando Expo (SDK 54+), Firebase Cloud Messaging (FCM V1) y nuestro backend propio.

Esta guía servirá como referencia para el futuro o si se requiere recrear el entorno.

---

## 1️⃣ Creación y Enlace del Proyecto en Expo (EAS)
Para que el servicio de Push de Expo funcione, la app debe estar vinculada a un proyecto real en `expo.dev`.

1. Nos aseguramos de tener la CLI instalada: `npm install -g eas-cli`
2. Nos logueamos en nuestra cuenta: `eas login`
3. En la raíz del proyecto ejecutamos: `eas init`
4. Esto creó automáticamente un proyecto en la nube y agregó el UUID en `app.json`:
   ```json
   "extra": {
     "eas": {
       "projectId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
     }
   }
   ```
*(Ojo: Si había un string de prueba como `"your-eas-project-id"`, debíamos borrarlo para que el `eas init` funcionara).*

---

## 2️⃣ Configuración del Cliente Android (google-services.json)
Para que Android pueda generar el token del dispositivo de Firebase (y pasárselo a Expo), el entorno nativo necesita el archivo `google-services.json`.

1. Fuimos a [Firebase Console](https://console.firebase.google.com/), creamos un proyecto y añadimos una App de Android usando **exactamente** nuestro Package Name (ej: `com.anonymous.prestamosyamobile`).
2. Descargamos el archivo `google-services.json` y lo colocamos en la **raíz del proyecto** móvil (`./google-services.json`).
3. Modificamos `app.json` para referenciar este archivo dentro del bloque de Android:
   ```json
   "android": {
     "package": "com.anonymous.prestamosyamobile",
     "googleServicesFile": "./google-services.json"
   }
   ```
4. Para que Expo inyectara el plugin de Firebase en el código nativo (`android/build.gradle`), corrimos el prebuild:
   ```bash
   npx expo prebuild --platform android --clean
   ```

---

## 3️⃣ Sincronización del Payload (Error 400 del Backend)
Una vez que el teléfono logró obtener el Token, el backend rechazaba la petición de guardado arrojando un **Status Code 400 (Bad Request)**. 

**Causa:**
El backend usa `class-validator` con la opción de seguridad estricta `forbidNonWhitelisted: true`. El servicio de React Native estaba enviando un campo extra (`deviceToken`) que no existía en el DTO del backend.

**Solución:**
En `services/notificationService.ts` ajustamos el payload para mandar estrictamente los datos que el DTO espera:
```typescript
const body = {
  token: payload.token,
  platform: payload.platform || 'expo',
};
```
*(Al remover el campo no declarado, el backend respondió `201 Created` y guardó el token en la BD).*

---

## 4️⃣ Dar Permisos a los Servidores de Expo (FCM V1)
Aunque el token se generaba y guardaba, los mensajes no llegaban (`pushFailed: 1`). Esto se debe a que Google depreció el "FCM Legacy" y ahora usa "FCM V1". Los servidores de Expo necesitan autenticarse ante Google en nombre de nuestra app.

1. En Firebase Console -> Configuración del Proyecto -> **Cuentas de Servicio**, generamos una nueva Clave Privada (un archivo `.json` de Service Account).
2. Creamos (si no existía) un archivo básico `eas.json` en la raíz de nuestro código con:
   ```json
   {
     "cli": { "version": ">= 10.2.0" },
     "build": {
       "production": {}
     }
   }
   ```
3. Ejecutamos la herramienta interactiva de Expo:
   ```bash
   eas credentials
   ```
4. Seguimos la ruta en el menú:
   - `Android` -> `production`
   - `Manage your Google Service Account Key for Push Notifications (FCM V1)`
   - `Set up a Google Service Account Key...`
5. Proporcionamos la **ruta absoluta** hacia nuestro archivo de clave Service Account descargado de Firebase.
6. La CLI subió el archivo de manera segura a los servidores de `expo.dev`.

---

## ✅ Resumen del Flujo Exitoso Final
Con toda la arquitectura completada:
1. **App arranca** -> Lee `google-services.json` -> Obtiene FCM Token nativo.
2. **App contacta a Expo** -> Convierte FCM Token a `ExponentPushToken[...]`.
3. **App contacta a Backend** -> Envía payload limpio -> Backend guarda (Status 201).
4. **Backend envía Push** -> Manda payload a `exp.host/--/api/v2/push/send`.
5. **Servidor Expo recibe Push** -> Usa nuestra FCM Service Account subida vía CLI -> Manda el push a Google.
6. **Google FCM entrega Push** -> ¡El celular vibra y suena! 🚀
