# 📱 PrestamosYA Mobile

<div align="center">

![Expo SDK 54](https://img.shields.io/badge/Expo-v54.0.35-000000?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![NativeWind](https://img.shields.io/badge/NativeWind-v4.2.1-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-v5-443E38?style=for-the-badge)

**Aplicación móvil nativa para la gestión integral de micro-préstamos, cobros diarios, directorio de clientes con GPS, seguimiento de garantías y análisis de métricas financieras.**

</div>

---

## 📌 Tabla de Contenidos
- [Visión General](#-visión-general)
- [✨ Características Principales](#-características-principales)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [📖 Documentación Interna para Agentes (`.agents/`)](#-documentación-interna-para-agentes-agents)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🎨 Sistema de Diseño y Moneda](#-sistema-de-diseño-y-moneda)
- [🔔 Notificaciones Push](#-notificaciones-push)
- [📜 Licencia](#-licencia)

---

## 🎯 Visión General

**PrestamosYA Mobile** es la solución en movilidad pensada para prestamistas y agentes de cobro de campo. Diseñada con un enfoque *mobile-first* sobre **Expo SDK 54** y **React Native**, la aplicación ofrece soporte completo **bimonetario (BOB / USD)**, sincronización en tiempo real mediante **TanStack React Query**, mapa interactivo integrado con **OpenStreetMap**, alta precisión en geolocalización GPS y un motor de notificaciones push basado en **Firebase FCM V1**.

---

## ✨ Características Principales

### 🏠 1. Dashboard Principal (Inicio)
- **Capital en Calle**: Visualización clara del capital invertido en Bolivianos (`Bs.-`) y Dólares (`$us`).
- **Resumen de Cartera**: Tarjetas de indicadores con estado de salud de préstamos y porcentaje de morosidad dinámico.
- **Cobros Prioritarios**: Lista Top-10 de cuotas vencidas con acceso rápido a llamadas telefónicas y contacto vía **WhatsApp** utilizando el selector nativo del sistema operativo.

### 👥 2. Gestión de Clientes y Perfil
- **Directorio de Clientes**: Búsqueda rápida y vista en tarjeta con avatar de iniciales e información de contacto.
- **Alta de Clientes con GPS**: Selección interactiva de coordenadas en mapa (redondeadas a 6 decimales) y geocodificación inversa automática para llenar la dirección de cobro.
- **Perfil 360° del Cliente**:
  - **Créditos**: Préstamos activos y finalizados con acordión interactivo que carga el cronograma detallado a demanda.
  - **Garantías**: Gestión de bienes (Vehículos, Inmuebles, Muebles, Otros) con soporte de fotografías, visor a pantalla completa y modal de formulario rápido.
  - **Ubicación**: Mapa dinámico (OpenStreetMap Leaflet sin costo de API) con botones para abrir en aplicaciones externas como Google Maps o Apple Maps.

### 💵 3. Módulo de Préstamos y Simulador
- **Wizard de Creación**: Proceso guiado en 3 pasos con cálculo previo sin persistencia (simulación).
- **Modo Automático**: Generación de cuotas fijas o cálculo directo de intereses a partir de monto, tasa y frecuencia.
- **Modo Manual**: Definición personalizada de cuotas y fechas mediante arrays dinámicos.
- **Soporte Multimoneda**: Emisión en Bolivianos (`BOB`) o Dólares (`USD`).

### 📅 4. Módulo de Cobros Diarios
- **Carrusel de Fechas**: Navegación horizontal por ventana de 11 días (5 días antes, hoy, 5 días después) con desplazamiento automático.
- **Listado de Cuotas**: Clasificación visual en tres categorías: *Por Cobrar Hoy*, *Cobradas Hoy* y *Vencidas*.
- **Registro de Pagos**: Modal interactivo con distribución automática **FIFO** sobre cuotas pendientes y soporte para modalidades de pago en **Efectivo** o **Transferencia QR**.

### 📊 5. Resumen Financiero y Métricas
- **Navegador de Meses**: Análisis de desempeño histórico mes a mes.
- **Métricas del Período**: Intereses cobrados, ingresos esperados vs. reales, eficiencia de recaudación y tasa de retorno sobre capital.
- **Foto de Cartera "Hoy"**: Indicadores en vivo de capital desplegado y capital en riesgo.
- **Gráfica Histórica**: Gráfico de barras nativo construido puramente con componentes `View` para comparar ganancias netas de los últimos 6 meses.

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología / Librería | Descripción |
|---|---|---|
| **Core Framework** | Expo SDK 54 (React Native 0.81.5) | Framework nativo de rendimiento optimizado con soporte edge-to-edge |
| **Enrutamiento** | Expo Router v6 | Enrutamiento basado en archivos (`app/`) |
| **Estilos & UI** | NativeWind v4 + Tailwind CSS v3 | Estilizado declarativo con utilidades Tailwind |
| **Componentes UI** | React Native Reusables (RNR) | Primitivos basados en `@rn-primitives` (equivalente a shadcn/ui) |
| **Estado Servidor** | TanStack React Query v5 | Cache, invalidación de consultas y manejo de estados asíncronos |
| **Estado Cliente** | Zustand v5 | Almacenamiento liviano para autenticación y estados UI efímeros |
| **Formularios & Zod** | React Hook Form + Zod v4 | Manejo de formularios nativos y validación estricta de esquemas |
| **HTTP & API** | Axios v1 | Cliente HTTP centralizado con interceptores de Auth y refresco de sesión |
| **Teclado Nativo** | `react-native-keyboard-controller` | Animación fluida de scroll sincronizado con el teclado nativo |
| **Mapas & GPS** | `react-native-webview` + Leaflet.js | Mapas OpenStreetMap sin clave API + `expo-location` para GPS |
| **Seguridad** | `expo-secure-store` | Guardado seguro de tokens JWT en Keychain / Keystore nativo |
| **Push Notifications** | `expo-notifications` + Firebase FCM V1 | Manejo de notificaciones nativas en Android/iOS |

---

## 📁 Estructura del Proyecto

```text
prestamosya-mobile/
├── .agents/                 # 📖 Directivas de arquitectura y guías para Agentes de IA
├── app/                     # 🗺️ Rutas de Expo Router (File-based Routing)
│   ├── (auth)/              # Rutas públicas (Login)
│   ├── (app)/               # Rutas autenticadas protegidas
│   │   ├── (tabs)/          # Tabs principales (Inicio, Clientes, Nuevo, Cobros, Resumen)
│   │   ├── client/          # Detalle y creación de clientes (ej. client/[id].tsx)
│   │   └── loan/            # Detalle de préstamos y pagos (ej. loan/[id].tsx)
│   └── _layout.tsx          # Layout raíz (Providers, Auth Hydration, PortalHost)
├── components/              # 🧩 Componentes divididos por dominio
│   ├── client-detail/       # Tabs y modales del perfil de cliente
│   ├── clients/             # Formularios y mapa de alta de cliente
│   ├── collections/         # Módulo de cobros diarios y registro de pago
│   ├── home/                # Componentes del dashboard principal
│   ├── notifications/       # Listado y vistas de notificaciones
│   ├── summary/             # Tarjetas y gráficos del reporte financiero
│   └── ui/                  # Componentes base RNR (Button, Dialog, Input, etc.)
├── config/                  # ⚙️ Configuraciones de entorno
├── hooks/                   # 🪝 Hooks personalizados de React Query y UI
├── lib/                     # 🛠️ Utilidades compartidas
│   ├── format.ts            # Formateo único de moneda (BOB/USD) y fechas en Bolivia
│   ├── theme/               # Paleta de colores e integración con React Navigation
│   ├── whatsapp.ts          # Integración directa con WhatsApp nativo
│   └── secureStorage.ts     # Wrapper seguro para almacenamiento de tokens JWT
├── services/                # 🌐 Cliente Axios y servicios de API (auth, client, loan, etc.)
├── stores/                  # 🧠 Tiendas de Zustand (authStore, newLoanStore)
├── types/                   # 📐 Definiciones de tipos TypeScript (client, loan, payment, etc.)
├── global.css               # 🎨 Definición de variables CSS de marca y modo oscuro
├── tailwind.config.js       # ⚙️ Mapeo de tokens CSS a clases Tailwind
├── app.json                 # ⚙️ Configuración del proyecto Expo (Plugins, Deep Links, Push)
└── README.md                # 📄 Documentación general del repositorio
```

---

## 📖 Documentación Interna para Agentes (`.agents/`)

Este repositorio cuenta con un directorio especializado `.agents/` que define los contratos de desarrollo y guías de arquitectura que cualquier desarrollador o agente de IA debe consultar antes de realizar cambios:

1. [**`AGENTS.md`**](./AGENTS.md): Directiva principal y reglas críticas del proyecto.
2. [**`STACK.md`**](./.agents/STACK.md): Explicación detallada de dependencias principales, versiones y wrappers de compatibilidad Web (`.web.tsx`).
3. [**`ROUTING.md`**](./.agents/ROUTING.md): Guía de rutas en `app/`, navegación fuera de tabs, área segura (*Safe Areas*) e interceptación del FAB central.
4. [**`UI_AND_STYLES.md`**](./.agents/UI_AND_STYLES.md): Reglas de estilizado con NativeWind, paleta centralizada en `lib/theme/`, tipografía móvil y uso del `<PortalHost />`.
5. [**`DATA_AND_STATE.md`**](./.agents/DATA_AND_STATE.md): Integración de Axios, React Query, Zustand y reglas de estado de servidor vs. cliente.
6. [**`FORMS.md`**](./.agents/FORMS.md): Implementación estándar de React Hook Form + Zod, manejo del teclado y componentes picker.
7. [**`CURRENCY.md`**](./.agents/CURRENCY.md): Patrón multimoneda (`BOB` vs. `USD`), reglas de propagación de datos y uso de `formatCurrency` vs. `formatAmountNumber`.
8. [**`PUSH_NOTIFICATIONS.md`**](./.agents/PUSH_NOTIFICATIONS.md): Guía paso a paso del flujo de Notificaciones Push con Expo EAS y Firebase Cloud Messaging V1.
9. [**`TROUBLESHOOTING.md`**](./.agents/TROUBLESHOOTING.md): Solución a problemas conocidos (Reanimated, TurboModules, listas anidadas, iconos en modo oscuro).

---

## 🚀 Instalación y Configuración

### 1️⃣ Prerrequisitos
- **Node.js**: v18.x o superior
- **npm**: v9.x o superior
- **Expo Go** instalado en un dispositivo físico (Android/iOS) o emulador configurado.

### 2️⃣ Clonar e instalar dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd prestamosya-mobile
npm install
```

> ⚠️ **Importante**: No eliminar `package-lock.json` para preservar la resolución de dependencias entre `react-native-reanimated` y `react-native-worklets`.

### 3️⃣ Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto tomando como plantilla `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://<TU_IP_LOCAL>:3000/api
```

*(Nota: Usa la IP local de tu máquina en la red local si estás probando con un celular físico en Expo Go).*

### 4️⃣ Ejecutar en entorno de desarrollo

- **Iniciar bundler de Metro**:
  ```bash
  npm start
  ```
- **Ejecutar en Android**:
  ```bash
  npm run android
  ```
- **Ejecutar en iOS**:
  ```bash
  npm run ios
  ```
- **Ejecutar en Web**:
  ```bash
  npm run web
  ```
- **Validación de tipos TypeScript**:
  ```bash
  npm run typecheck
  ```

---

## 🎨 Sistema de Diseño y Moneda

### 🌈 Paleta de Marca

| Color | Hex | Token CSS | Uso |
|---|---|---|---|
| **Celeste** | `#6DB6EF` | `--primary` | Color principal de marca, enlaces, acentos principales en modo oscuro |
| **Azul** | `#2368A3` | `--secondary` | Color secundario, botones primarios en modo claro, encabezados de módulo |
| **Verde** | `#C5DB70` | `--accent` | Acento de éxito, FAB "+" central de navegación, botones de acción |
| **Blanco** | `#FDFDFB` | `--background` | Fondo en modo claro |

### 💱 Formateo de Moneda y Fechas (`lib/format.ts`)
Para evitar discrepancias en la presentación visual, se debe usar la fuente única de verdad para el formateo:

```ts
import { formatBs, formatCurrency, formatAmountNumber, formatDateBO } from '@/lib/format';

// Formateo textual completo:
formatCurrency(1500, 'BOB'); // → "Bs.- 1.500"
formatCurrency(250, 'USD');  // → "$us 250"

// Cifra numérica limpia (cuando la tarjeta ya muestra la badge de la moneda):
formatAmountNumber(1500);    // → "1.500"

// Fechas en formato boliviano (evita errores UTC -1 día):
formatDateBO('2026-10-21');   // → "21 oct. 2026"
```

---

## 🔔 Notificaciones Push

La aplicación soporta notificaciones push nativas mediante **Expo Push Notifications** integradas con **Firebase FCM V1**:
- El proyecto en Expo se vincula mediante `eas init`.
- La clave de Service Account de Google para FCM V1 se gestiona y sube de forma segura a través de `eas credentials`.
- Al iniciar la sesión, el token nativo obtenido se registra automáticamente en el backend (`POST /api/notifications/device-tokens`).

---

## 📜 Licencia

Este proyecto es de carácter privado y propietario para la plataforma **PrestamosYA**. Todos los derechos reservados.
