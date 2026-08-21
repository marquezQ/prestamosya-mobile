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

## 📄 Collections & Payments Module — Data Layer (⚠️ MOCK PHASE)

El tab Cobros y el flujo de registro de pagos son **solo interfaz**: todos los datos provienen de `components/collections/mockPaymentData.ts`. Al conectar el backend, reemplazar según esta tabla — los componentes NO deben necesitar cambios más allá de swappear la fuente de datos:

| Actual (mock) | Objetivo (backend) |
|---|---|
| Constante `MOCK_DASHBOARD_TODAY` en `CollectionsView` | Hook `usePaymentDashboard(date)` → `GET /payments/dashboard?date=YYYY-MM-DD` devolviendo `PaymentDashboardData` |
| Fallback `MOCK_LOAN_DETAILS_MAP[id] ?? MOCK_LOAN_DETAILS_MAP['uuid-loan-1']` en `app/(app)/loan/[id].tsx` | `useLoanById(id)` (hook existente, queryKey `['loans', id]`) + estado de loading/error real |
| `setTimeout(400)` simulando submit en `RegisterPaymentModal.onSubmit` | Mutación `useRegisterPayment()` → `POST /payments` con `RegisterPaymentInput`; invalidar `['loans', id]` y la query del dashboard |

### Types (`types/payment.ts`)
- `PaymentDashboardData`: `{ metadata, dueToday[], overdue[], paidToday[] }` de `DashboardInstallmentItem`.
- `RegisterPaymentInput`: `{ loanId, amount, method, paymentDate, notes? }`. La respuesta envuelve `affectedInstallments[]`, `loanStatus` y `outstandingBalance`.
- **`PaymentMethod = 'cash' | 'transfer'`** — NO existe método `'qr'`: en Bolivia los pagos QR SON transferencias. El chip "Transferencia / QR" usa icono `QrCode` intencionalmente.

### Convenciones establecidas en este módulo
- Nombre y CI del cliente en el detalle de préstamo SIEMPRE desde `loanDetail.loan.clientName/clientIdNumber` — nunca desde params de ruta ni defaults de props.
- Config única de badges de estado: `getInstallmentStatusConfig()` en `components/collections/installmentStatus.tsx`.
- Helpers de formato compartidos en `lib/format.ts` (`formatBs`, `formatDateBO`, `getTodayISO`, `getInitials`) — no duplicar localmente.
- El modal de pago usa RNR `Dialog` (patrón `GuaranteeFormModal`). Si se agregan campos, mantener `ScrollView` con `keyboardShouldPersistTaps="handled"` dentro de `DialogContent`.



