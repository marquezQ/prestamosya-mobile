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
- **Backend Mapping**: Ensure the authentication payload mapping matches the backend. The NestJS backend returns `accessToken`, so `useAuth` correctly extracts `data.accessToken` (not `data.token`) to save it.

## 🧠 Client State: Zustand

Global client state (e.g., current selected theme, UI toggles, non-persistent user preferences) is managed by **Zustand**.

- Stores should be created in the `stores/` directory.
- Barrel export them from `stores/index.ts` if needed.
- **CRITICAL**: Do NOT use `persist` middleware (like `createJSONStorage`) to persist secure tokens. Tokens live strictly in `lib/secureStorage.ts`.
- For the authentication state (`authStore.ts`), the store should maintain ephemeral state (`user`, `isAuthenticated`, `isHydrated`). When the app loads, `hydrate()` is called to fetch the token from `secureStorage`, fetching the user profile if the token exists, and updating the state accordingly.

**Rule of Thumb**:
- Does it come from the database? -> React Query.
- Is it a local UI toggle or temporary client state? -> Zustand.

---

## 📄 Client Detail Module — Data Layer

### Services & Hooks
| File | Responsibility |
|---|---|
| `services/endpoints.ts` | `CLIENTS.GET_ALL`, `CLIENTS.GET_BY_ID(id)` and `LOANS.GET_BY_ID(id)` |
| `services/clientService.ts` | `getClients()` and `getClientById(id)` |
| `services/loanService.ts` | `getLoanById(id)` — fetches loan details, installments, and payments |
| `hooks/useClients.ts` | React Query hook for the clients list |
| `hooks/useClientById.ts` | React Query hook for a single client. QueryKey: `['clients', id]` |
| `hooks/useLoanById.ts` | React Query hook for loan details with installments. QueryKey: `['loans', id]` (fetched on-demand when an accordion card is expanded) |

### Backend Response Shape (GET /clients/:id)
```json
{
  "data": {
    "client": { ...Client },
    "activeLoans": [ ...ClientLoanSummary ],
    "completedLoans": [ ...ClientLoanSummary ],
    "guarantees": [ ...ClientGuaranteeSummary ]
  }
}
```

### On-Demand Schedule Fetching (GET /loans/:id)
- When a user taps/opens an accordion card (`LoanAccordionCard` or `CompletedLoanAccordionCard`), `useLoanById(loan.id, isOpen)` triggers `GET /api/loans/:id`.
- While fetching, a centered **ActivityIndicator** spinner is rendered inside the accordion.
- Once loaded, the component renders real debt totals, outstanding balance, and the full installments array (`installments`).

---

## 📄 Guarantees Module — Data Layer

### Services & Hooks
| File | Responsibility |
|---|---|
| `services/endpoints.ts` | `GUARANTEES.BASE` (`/guarantees`) and `GUARANTEES.GET_BY_ID(id)` |
| `services/guaranteeService.ts` | `getGuaranteesByClientId(clientId)`, `createGuarantee(data)`, `updateGuarantee(id, data)`, `deleteGuarantee(id)` |
| `hooks/useGuarantees.ts` | Custom hooks: `useGuaranteesByClientId`, `useCreateGuarantee`, `useUpdateGuarantee`, `useDeleteGuarantee` |

### Data Model (`types/guarantee.ts`)
- `GuaranteeType`: `'VEHICLE' | 'REAL_ESTATE' | 'FURNITURE' | 'OTHER'`
- `GuaranteeStatus`: `'AVAILABLE' | 'IN_USE' | 'RELEASED'`
- Payload shape for `POST /api/guarantees`: `{ clientId, type, description, estimatedValue }`
- Business rule on `DELETE /api/guarantees/:id`: The backend returns HTTP `400 Conflict` if status is `'IN_USE'`. Handled in `DeleteGuaranteeDialog.tsx` with a warning message.

## 📄 Client Create Module — Data Layer

| File | Responsibility |
|---|---|
| `services/endpoints.ts` | `CLIENTS.CREATE` → `POST /clients` |
| `services/clientService.ts` | `createClient(data)` via the centralized Axios instance |
| `hooks/useCreateClient.ts` | React Query `useMutation`; invalidates queryKey `['clients']` on success |
| `components/clients/ClientForm.tsx` | RHF + Zod form that calls `useCreateClient` |

- Payload shape matches `ClientCreateInput` in `types/client.ts`; optional fields (`phoneAlt`, `address`, `latitude`, `longitude`, `notes`) are nullable.
- **Backend constraint (NestJS)**: `latitude`/`longitude` are validated with `@IsNumber({ maxDecimalPlaces: 8 })`. Coordinates must stay ≤8 decimals — the app rounds to 6 in `LocationPicker`. See `.agents/FORMS.md`.
- The backend returns **`409 Conflict`** on duplicate CI or phone — handled in `ClientForm` (shows a specific error message).

---

## 📄 Loans Module — Simulation & Creation Data Layer

### Services & Hooks
| File | Responsibility |
|---|---|
| `services/endpoints.ts` | `LOANS.SIMULATE` (`POST /loans/simulate`) and `LOANS.CREATE` (`POST /loans`) |
| `services/loanService.ts` | `simulateLoan(params)` and `createLoan(data)` via central Axios instance |
| `hooks/useSimulateLoan.ts` | React Query `useMutation` for `/loans/simulate` (calculates projected schedule without DB persistence) |
| `hooks/useCreateLoan.ts` | React Query `useMutation` for `/loans`; invalidates queryKey `['clients']` on success |
| `stores/newLoanStore.ts` | Zustand store maintaining `loanMode` ('automatic' \| 'manual') and `schedule` state |

### UI Component Architecture (SOLID & Single Responsibility)
- `StepConfigureLoan.tsx`: Clean parent container managing the mode selection `<Tabs>`.
- `AutomaticLoanForm.tsx`: Dedicated form for automatic loan parameters. Calls `useSimulateLoan` sending `firstDueDate = startDate` (single date picker).
- `ManualLoanForm.tsx`: Dedicated form for manual loan parameters and dynamic custom installment rows array using `useFieldArray`.
- `ManualInstallmentRow.tsx`: Small reusable component for individual manual installment row rendering.
- `SchedulePreview.tsx`: Clean read-only schedule presentation table.
- `StepSummary.tsx`: Final confirmation view with badge `Cronograma calculado: Automático` or `Cronograma calculado: Manual`.

---

## 📄 Collections & Payments Module — Data Layer

El tab Cobros y el flujo de pagos están conectados al backend real.

### Services & Hooks
| File | Responsibility |
|---|---|
| `services/endpoints.ts` | `PAYMENTS.BASE` (`/payments`), `PAYMENTS.DASHBOARD`, `PAYMENTS.REGISTER` |
| `services/paymentService.ts` | `getPaymentDashboard(date?)` y `registerPayment(data)` vía Axios central |
| `hooks/usePaymentDashboard.ts` | React Query hook. QueryKey: `['payments', 'dashboard', date]`. Recibe la fecha del carrusel en `'yyyy-MM-dd'` |
| `hooks/useRegisterPayment.ts` | Mutación `POST /payments`. Invalida `['payments']`, `['loans', loanId]` y `['clients']` al éxito |

### Endpoints del backend
1. **GET /payments/dashboard?date=YYYY-MM-DD** → `{ metadata: { targetDate, serverToday }, dueToday[], overdue[], paidToday[] }` de `DashboardInstallmentItem`.
2. **POST /payments** → body `RegisterPaymentInput`; el backend distribuye el monto FIFO sobre cuotas pendientes. Respuesta incluye `affectedInstallments[]`, `loanStatus` y `outstandingBalance` (usados en el banner de éxito de `LoanDetailPaymentView`).
3. **DELETE /payments/:id** con body `{ reason }` → ⚠️ **pendiente de UI** (anulación de pagos). No hay servicio ni hook todavía.
4. **GET /loans/:id** → detalle usado por `app/(app)/loan/[id].tsx` vía `useLoanById(id, true)` con estados de loading/error/retry propios de la pantalla.

### Tipos (`types/payment.ts`)
- **`PaymentMethod = 'cash' | 'transfer'`** — decisión de producto: NO se envía 'qr' aunque el enum del backend lo acepte; los pagos QR van como 'transfer' y el chip "Transferencia / QR" usa icono QrCode intencionalmente.
- El backend NO devuelve `scheduledTime` en el dashboard — no renderizarlo.
- Errores HTTP se muestran inline con `getApiErrorMessage()` (exportado en `services/api.ts`; NestJS puede devolver `message` como string o string[]).

### Convenciones establecidas en este módulo
- Nombre y CI del cliente en el detalle de préstamo SIEMPRE desde `loanDetail.loan.clientName/clientIdNumber` — nunca desde params de ruta ni defaults de props.
- Labels dinámicos: cuando `selectedDate !== metadata.serverToday`, los títulos dicen "Cuotas/Cobrados del {fecha}" en vez de "de hoy".
- Config única de badges de estado: `getInstallmentStatusConfig()` en `components/collections/installmentStatus.tsx`.
- Helpers de formato compartidos en `lib/format.ts` (`formatBs`, `formatDateBO`, `getTodayISO`, `getInitials`) — no duplicar localmente.
- El modal de pago usa RNR `Dialog` (patrón `GuaranteeFormModal`). Si se agregan campos, mantener `ScrollView` con `keyboardShouldPersistTaps="handled"` dentro de `DialogContent`.



