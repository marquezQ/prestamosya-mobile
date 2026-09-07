# Currency — Patrón de Moneda Multimoneda

La app soporta préstamos y cuotas en dos monedas: **BOB (Bolivianos)** y **USD (Dólares)**.

El tipo central es `Currency = 'BOB' | 'USD'` definido en `types/loan.ts` e importado desde todos los módulos que lo necesitan.

---

## 🏦 Dónde Viene el `currency`

El campo `currency` **siempre lo provee el backend** en la respuesta de la entidad correspondiente. Nunca se debe asumir ni inventar.

| Endpoint / Entidad | Campo | Tipo |
|---|---|---|
| `GET /loans/:id` | `loan.currency` | `string` (cast a `Currency` en `LoanDetailPaymentView`) |
| `GET /payments/dashboard` | `DashboardInstallmentItem.currency` | `Currency` (enviado por el backend desde la [conversación 7b30af6b]) |
| `GET /dashboard/home` → `overdueInstallments` | `OverdueInstallmentItem.currency` | `Currency` |
| `POST /loans` (créación) | `CreateAutomaticLoanInput.currency` | `Currency` (seleccionado en el form) |
| `GET /dashboard/home` → `capitalEnCalle` | `CapitalEnCalle.BOB` / `CapitalEnCalle.USD` | Separado por clave, no por campo `currency` |

---

## 🔁 Cómo se Propaga (Prop Drilling)

El `currency` se lee una sola vez en el componente orquestador de cada pantalla y se pasa por props hacia abajo. **No se usa Context ni Zustand** para esto porque es un dato de solo lectura ligado a un préstamo específico.

### Flujo del Detalle de Préstamo (`app/(app)/loan/[id].tsx`)

```
useLoanById(id)
  └── LoanDetailPaymentView (lee: loan.currency → cast a Currency)
        ├── LoanMetricsCard          (recibe: currency?)
        ├── LoanScheduleTable        (recibe: currency?)
        ├── LoanPaymentHistoryList   (recibe: currency?)
        │     └── VoidPaymentDialog  (recibe: currency?)
        ├── RegisterPaymentModal     (recibe: currency?)
        └── SettleLoanModal          (recibe: currency?)
```

El cast desde `string` a `Currency` se hace **solo una vez** en `LoanDetailPaymentView.tsx`:
```ts
const currency: Currency = (loan.currency as Currency) || 'BOB';
```
> `|| 'BOB'` actúa como fallback defensivo para préstamos antiguos sin `currency`.

### Flujo del Dashboard de Cobros (`CollectionsView`)

Las cuotas (`DashboardInstallmentItem`) ya traen `currency` directamente del backend. `CollectionsView` las agrupa por moneda para construir las tarjetas de progreso:
```ts
const bobDueToday = dueToday.filter((i) => (i.currency || 'BOB') === 'BOB');
const usdDueToday = dueToday.filter((i) => i.currency === 'USD');
```
Cada `InstallmentCard` y `OverdueInstallmentCard` recibe el item completo y usa `item.currency || 'BOB'` al llamar `formatCurrency`.

### Flujo del Home — Cuotas en Mora (`OverdueCollectionList`)

`OverdueInstallmentItem` del endpoint `GET /dashboard/home` ya incluye `currency`. Se usa directamente en `formatCurrency(item.pendingAmount, item.currency)`.

---

## 🎨 Convenciones de Presentación Visual

| Contexto | Helper | Ejemplo |
|---|---|---|
| Montos completos en texto (mensajes, banners, modales) | `formatCurrency(amount, currency)` | `"Bs.- 1.500"` / `"$us 200"` |
| Cifra numérica en tarjeta donde la etiqueta de moneda ya es visible | `formatAmountNumber(amount)` | `"1.500"` |
| Label de campo de formulario | Template literal | `Monto ({currency === 'USD' ? '$us' : 'Bs.-'}) *` |
| Badge de moneda en tarjeta Capital en Calle | Texto estático por sub-tarjeta | `"Bs.-"` (BOB) / `"$us"` (USD) |

### `formatAmountNumber` vs `formatCurrency`

```ts
// Ambas en lib/format.ts

formatCurrency(1500, 'BOB')   // → "Bs.- 1.500"  ← usar en textos solos
formatCurrency(1500, 'USD')   // → "$us 1.500"

formatAmountNumber(1500)      // → "1.500"         ← usar cuando la etiqueta de moneda
                              //                      está visible como badge separado
```

> **Regla:** Usar `formatAmountNumber` + badge de moneda separado cuando el layout es simétrico y la unidad monetaria ya está indicada visualmente (ej. `OutstandingCapitalCard`). En todos los demás contextos usar `formatCurrency`.

---

## 🛡️ Defaults Defensivos

Varios componentes aceptan `currency?: Currency` con default `'BOB'`:
- `LoanMetricsCard`, `LoanScheduleTable`, `LoanPaymentHistoryList`, `VoidPaymentDialog`, `RegisterPaymentModal`, `SettleLoanModal`.

Esto protege contra casos edge donde `currency` llegue `undefined` (préstamos legacy o errores del backend). **No interpretar estos defaults como un hardcodeo** — son fallbacks de último recurso.

---

## ⚠️ Capital en Calle — Caso Especial

`CapitalEnCalle` **no usa el campo `currency`**. En cambio, tiene una estructura de objeto separado por moneda:

```ts
interface CapitalEnCalle {
  BOB: number;  // total invertido en Bolivianos
  USD: number;  // total invertido en Dólares
}
```

La sub-tarjeta de USD solo se muestra si `capital.USD > 0`. Ambas sub-tarjetas muestran cifras con `formatAmountNumber()` + badge estático `Bs.-` / `$us`.
