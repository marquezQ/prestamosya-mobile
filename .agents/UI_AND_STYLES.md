# UI & Styling Context

## 🎨 NativeWind v4 & Tailwind CSS

This project uses **NativeWind v4**. This means we write React Native styling using Tailwind CSS utility classes via the `className` prop.

**CRITICAL RULE: Always use `className` instead of inline `style={{...}}`.**
*Exception*: You CANNOT use `className` inside Expo Router configuration objects (like `screenOptions`, `tabBarStyle`, `headerStyle`). Those require standard React Native style objects or hex colors because they are not React components being processed by NativeWind. However, if an option accepts a React Component (e.g., `headerTitle: () => <View className="..." />`), you CAN and SHOULD use `className` inside that component.

For imperative style APIs (React Navigation, Lucide `color` prop, etc.), import tokens from `@/lib/theme` instead of hardcoding hex values.

## 🧩 React Native Reusables (RNR)

We do not write generic UI components (Buttons, Modals, Dropdowns) from scratch. We use React Native Reusables (similar to shadcn/ui).

- Components are located in `components/ui/`.
- **They are source code, not node_modules**. You can and should modify them if a specific design change is needed globally.
- They rely on `@rn-primitives/*` for accessibility and behavior, and NativeWind for styling.
- To add a new component (e.g., Toast, Input), use the CLI: `npx @react-native-reusables/cli@latest add [component]`

## 🌗 Theme & Colors

### Arquitectura del tema (fuente única)

| Capa | Archivo | Uso |
|------|---------|-----|
| **CSS / Tailwind** | `global.css` | Variables `--brand-*` y tokens semánticos (`--primary`, `--accent`, etc.) |
| **Tailwind config** | `tailwind.config.js` | Mapea variables a clases (`bg-primary`, `text-secondary`, `bg-brand-verde`) |
| **JS imperativo** | `lib/theme/colors.ts` | Misma paleta en hex para React Navigation, iconos, `tabBarStyle` |
| **React Navigation** | `lib/theme/navigation.ts` | Tema de navegación derivado de los tokens |

> **Regla:** Para cambiar un color de marca en toda la app, edita `--brand-*` en `global.css` y el objeto `palette` en `lib/theme/colors.ts` (mantener ambos sincronizados).

### Colores Pivote (PrestamosYA)

| Marca | Hex | Token semántico | Clase Tailwind |
|-------|-----|-----------------|----------------|
| **Celeste** (primario) | `#6DB6EF` | `--primary` / `palette.celeste` | `bg-primary`, `text-primary`, `bg-brand-celeste` |
| **Azul** (alternativo) | `#2368A3` | `--secondary` / `palette.azul` | `bg-secondary`, `text-secondary`, `bg-brand-azul` |
| **Verde** (alternativo) | `#C5DB70` | `--accent` / `palette.verde` | `bg-accent`, `text-accent`, `bg-brand-verde` |
| **Blanco** | `#FDFDFB` | `--background` (modo claro) / `palette.blanco` | `bg-background`, `bg-brand-blanco` |

### Modo claro vs oscuro

- **Pantallas y componentes RNR:** usar clases semánticas con variante `dark:` (`bg-background`, `text-foreground`, `text-secondary dark:text-primary`).
- **Tabs / navegación:** usar `getThemeColors(colorScheme)` de `@/lib/theme`.
- **Toggle de tema:** `useColorScheme()` de `nativewind` + `ThemeProvider` en `app/_layout.tsx` con `getNavigationTheme()`.

**CRITICAL RULE for Text and RNR Components:**
When working inside complex RNR components (like `DropdownMenu`, `Dialog`, etc.), they use a `TextClassContext` to automatically pass adaptive semantic colors (like `--popover-foreground` or `--destructive`) to child text.
For this to work, you **must import `<Text>` from `@/components/ui/text`** instead of `react-native`. Using the default `react-native` Text component will ignore the context and texts might become invisible in Dark Mode.

Do not hardcode colors like `className="bg-blue-500"` or `color="#6DB6EF"` for core UI.

Use semantic classes:
- `bg-background` (App background)
- `bg-card` (Cards and panels)
- `text-foreground` (Main text)
- `text-muted-foreground` (Secondary/gray text)
- `bg-primary` (Celeste — main brand color)
- `bg-secondary` (Azul — alternative brand color)
- `bg-accent` (Verde — alternative brand color)
- `text-primary-foreground` (Text inside a primary button)

## 🪟 The PortalHost

Components like `Dialog`, `Select`, and `DropdownMenu` require a `<PortalHost />` to render over native elements.
**The `<PortalHost />` must be mounted INSIDE `ThemeProvider`/navigation context in `app/_layout.tsx`** (inside `RootLayoutNav`, as the last child of `ThemeProvider`). Do NOT place it at the root level outside the navigation container: any hook inside a portal that reads NavigationContainer context will crash or misbehave when it is mounted there. Do not mount duplicates either.

---

## 🗂️ Client Detail Module — Components

All components for the client profile detail screen live in `components/client-detail/`.

| Component | Responsibility |
|---|---|
| `ClientDetailView.tsx` | Main orchestrator with persistent 3-tab view (**Créditos**, **Garantías**, **Ubicación**). |
| `ClientProfileHeader.tsx` | Compact hero header (h-16 avatar, `CI: {idNumber}`, member-since date, Llamar + WhatsApp green button). |
| `ClientProfileTabs.tsx` | Persistent top tab bar with active indicator. |
| `LoanAccordionCard.tsx` | Accordion dropdown card for active loans. Triggers `GET /loans/:id` on expand, showing loading spinner and full schedule table (`Bs.- {monto}`). |
| `CompletedLoanAccordionCard.tsx` | Accordion dropdown card for completed loans. Triggers `GET /loans/:id` on expand. |
| `LoanProgressBar.tsx` | Reusable horizontal progress bar (`h-3`). |
| `ClientAddressMap.tsx` | Vertical `MapView` (`h-96`) + address card + "Abrir en Maps" (`Linking.openURL`) & "Compartir" (`Share.share`). |
| `ClientAddressMap.web.tsx` | Web fallback — placeholder map + "Abrir en Maps" & clipboard copy link fallback. |
| `tabs/CreditsTab.tsx` | Holds the two loan sections: **Préstamos Activos** and **Préstamos Finalizados**. |
| `tabs/GuaranteesTab.tsx` | Client guarantees list view with "+ Nueva Garantía" header button, status pills, and Edit/Delete actions. |
| `tabs/LocationTab.tsx` | Location tab view hosting `ClientAddressMap`. |
| `guarantees/GuaranteeFormModal.tsx` | Modal dialog built with RHF + Zod for creating and editing guarantees. |
| `guarantees/DeleteGuaranteeDialog.tsx` | Confirmation modal for soft delete with `IN_USE` warning validation. |

### Icon Color Convention (Lucide)
- **Lucide icons inside NativeWind components**: prefer `className="text-*"` for color.
- **Lucide icons that need an explicit color (e.g., inside Buttons, or cross-platform)**: pass the `color` prop with a hex value from `palette` or a hardcoded utility color (e.g., `color="#22c55e"` for green-500, `color="#ffffff"` for white).
- This avoids dark mode rendering issues where `className` text color may not propagate correctly through the RNR `TextClassContext`.

## 🗂️ Collections Module — Components

All components for the Cobros (collections) tab and the payment flow live in `components/collections/`.

| Component | Responsibility |
|---|---|
| `CollectionsView.tsx` | Orchestrator for the Cobros tab: header, `DateCarousel`, `DailyProgressCard` and the three installment sections. Currently fed by mock data. |
| `DateCarousel.tsx` | Horizontal 11-day window selector (5 before, today, 5 after) with auto-scroll to the selected day. |
| `DailyProgressCard.tsx` | Daily collection progress card (`Bs.-` amounts + progress bar). |
| `InstallmentCard.tsx` | Card for today's due installments and paid ones, with status badge from `installmentStatus`. |
| `OverdueInstallmentCard.tsx` | Red-highlighted card for overdue installments with days-overdue caption. |
| `installmentStatus.tsx` | **Single source of truth** for installment status badges (`getInstallmentStatusConfig`) — labels, Tailwind classes, icons. Consumed by all cards/tables in this module. |
| `loan-detail/LoanClientHeaderCard.tsx` | Client hero on loan detail (name, CI, phone actions). |
| `loan-detail/LoanMetricsCard.tsx` | Debt metrics + reuses `LoanProgressBar` from client-detail. |
| `loan-detail/LoanScheduleTable.tsx` | Installments table (#, Fecha, Monto, Estado). |
| `loan-detail/LoanPaymentHistoryList.tsx` | Payment history list. |
| `RegisterPaymentModal.tsx` | RHF + Zod form inside RNR `Dialog` for registering a payment. Mock submit via `setTimeout`; replace with a React Query mutation when wiring the backend. |
| `modal/PaymentMethodSelector.tsx` | Chip selector for `cash` / `transfer`. **'Transferencia' intentionally uses the QrCode icon** — transfers in Bolivia are mostly done via QR. |
| `modal/PaymentClientSummary.tsx` | Read-only client summary inside the modal. |
| `modal/PendingInstallmentsSummary.tsx` | First 2 pending installments preview inside the modal. |

### Route & data flow
- Tab screen: `app/(app)/(tabs)/collections.tsx` → renders `<CollectionsView />`.
- Detail: `app/(app)/loan/[id].tsx`, registered as `<Stack.Screen name="loan/[id]" />` in `app/(app)/_layout.tsx`. Client **name and CI always come from `loanDetail.loan`** (never from props defaults) to avoid cross-client data mismatches; only `clientPhone` travels as a route param.
- Shared formatting helpers (`formatBs`, `formatDateBO`, `getInitials`, `getTodayISO`) live in `lib/format.ts` — do not duplicate them locally.

---

## 🗂️ New Client Module — Components

The "Nuevo Cliente" screen (`app/(app)/client/new.tsx`) renders the form from `components/clients/`.

| Component | Responsibility |
|---|---|
| `components/clients/ClientForm.tsx` | RHF + Zod form. Submits via `useCreateClient`, wires the map's `onAddressFound` autofill into the address field. |
| `components/ui/LocationPicker.tsx` | Interactive `MapView` (tap-to-set marker) + "Ir a mi ubicación" button (expo-location). Rounds coords to 6 decimals (see FORMS.md). |
| `components/ui/LocationPicker.web.tsx` | Web fallback — no `MapView`, only the locate button. |
| `components/ui/KeyboardAwareScrollView.tsx` / `.web.tsx` | Cross-platform scroll that keeps focused inputs above the keyboard. See FORMS.md + STACK.md. |

### "Ir a mi ubicación" flow (LocationPicker)
- Checks `Location.hasServicesEnabledAsync()` → warns if GPS is off.
- Requests foreground permission; on denial offers "Abrir ajustes" (`Linking.openSettings()`).
- Uses `getCurrentPositionAsync({ accuracy: Balanced })`, rounds coords, reverse-geocodes to autofill the address, then `animateToRegion` on the map ref.
- Map height: `h-80`. The button is a full-width `secondary` variant below the map.

### CI (Carnet de Identidad) Display Convention
- The field `client.idNumber` is the Bolivian ID card number (CI).
- Always display it as: `CI: {client.idNumber}` — never transform, slice, or build a synthetic ID from initials.

---

## 📐 Typography Standards (Mobile-First)

> **Context:** Physical mobile screens have very high pixel density. Text that looks legible in a browser's responsive emulator will appear much smaller on a real device. All font sizes were scaled up as of August 2026 to ensure comfortable readability on physical Android/iOS devices.

**CRITICAL RULE: Never use `text-[10px]` or `text-[11px]` in new code. Those sizes are reserved for nothing — they are too small for any mobile UI element.** If you catch them in existing code, replace with `text-xs` minimum.

### Base Scale Reference

| Role | Class | px equivalent | Example usage |
|------|-------|---------------|---------------|
| **Screen Titles** | `text-xl` | 20px | Step titles ("Seleccionar Cliente"), Screen headers ("Nuevo Cliente") |
| **Card / Section Titles** | `text-lg` | 18px | Card headers ("Préstamo Activo"), Client name in lists |
| **Body / Reading text** | `text-base` | 16px | Subtitles, descriptions, input field content |
| **Secondary / Labels** | `text-sm` | 14px | Field labels (via `<Label>`), CI numbers, badges, helper text |
| **Tertiary / Captions** | `text-xs` | 12px | Column headers in tables, uppercase tracking labels (e.g., "SALDO PENDIENTE") |
| **Hero / KPI numbers** | `text-2xl` – `text-4xl` | 24–36px | Big monetary values (debt totals, stats counters) |

### Primitive Components (source of truth)

These components were modified at the source — all new forms/screens automatically inherit these sizes:

- **`components/ui/input.tsx`** → `text-lg` (18px), height `h-12` (48px touch target)
- **`components/ui/label.tsx`** → `text-base` (16px)

### Action Buttons (touch targets)

All primary CTA buttons must have a minimum height of `h-14` (56px) for comfortable thumb tapping.
- Primary buttons: `h-14`, button text `text-lg font-bold`
- Secondary / ghost buttons: `h-12`, button text `text-base font-semibold`
- Icon-only action buttons (Phone, WhatsApp): `h-12 w-12`

### Form Validation Errors

Validation error messages below inputs use `text-sm text-destructive mt-1`. Never use `text-xs` for errors.

### Placeholders

Input placeholders must be simple and minimal. Use plain `"0"` for numeric fields. Do NOT write "Ej. 1000", "Ej. 10%", etc.

### Dos and Don'ts

```
✅ DO
  <Text className="text-foreground font-bold text-xl">Seleccionar Cliente</Text>   // Screen title
  <Text className="text-muted-foreground text-base">Subtítulo descriptivo</Text>   // Subtitle
  <Text className="text-muted-foreground text-xs font-bold uppercase">SALDO</Text> // Table header

❌ DON'T
  <Text className="text-[10px]">...</Text>   // Too small, forbidden
  <Text className="text-[11px]">...</Text>   // Too small, forbidden
  <Text className="text-sm">Error message</Text> // Use text-sm, not text-xs for errors
  placeholder="Ej. 1000"                     // Use "0" for numeric inputs
```
