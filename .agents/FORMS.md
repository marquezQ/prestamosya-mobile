# Forms & Validation Context

## 🔐 Login — Reglas acordadas (frente y backend)

- **Usuario**: `min 3`, `max 20` caracteres (schema zod + `maxLength={20}` en el `Input`).
- **Contraseña**: `min 6` caracteres.
- `handleSubmit(onSubmit)` solo llama al submit si zod pasa; los errores de zod se pintan **debajo de cada campo** (`fieldError`). El recuadro rojo **superior** del login (`errorMessage`) NO es zod: se llena con `error.message` de la mutación `useLogin` tras una petición que llegó al server (mensaje del backend).
- **Regla:** los límites del schema zod deben ser **iguales o más estrictos** que los del backend, para que el cliente cortee antes y el usuario vea el mensaje de zod, no el del servidor.

## 📋 React Hook Form + Zod

Complex forms (like Login, Register, Loan Application) must be built using `react-hook-form` paired with `zod` for validation.

### Workflow:

1. **Define the Schema**: Create a Zod schema defining the expected shape and validation rules of the form.
```ts
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;
```

2. **Initialize the Form**: Use `useForm` with the `zodResolver`.
```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
  resolver: zodResolver(loginSchema),
});
```

3. **Bind Inputs**: In React Native, use the `Controller` component from `react-hook-form` to wrap custom UI components (like `Input` or `Select` from `components/ui/`) because React Native inputs do not support standard web HTML form propagation.

```tsx
import { Controller } from "react-hook-form";
import { TextInput, Text } from "react-native";

<Controller
  control={control}
  name="email"
  render={({ field: { onChange, onBlur, value } }) => (
    <>
      <TextInput
        className="border border-border p-2 rounded"
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
      />
      {errors.email && <Text className="text-destructive">{errors.email.message}</Text>}
    </>
  )}
/>
```

## ⌨️ Keyboard Handling in Forms

**CRITICAL**: SDK 54 runs with `edge-to-edge` enabled (forced on Android 15+). The OS no longer resizes the window when the keyboard opens, so React Native's built-in `KeyboardAvoidingView` is **unreliable on Android** — especially `behavior="height"` (known render-loop / input-covering bugs).

### 1. Pantallas Completas (Full Screens)
**Standard**: use `react-native-keyboard-controller` (bundled in Expo Go SDK 54, no dev build needed):
- `KeyboardProvider` must wrap the app — **already mounted in `app/_layout.tsx`**. Without it, `KeyboardAwareScrollView` logs `Couldn't find real values for KeyboardContext` and silently does nothing.
- Wrap scrollable forms in `KeyboardAwareScrollView` from `@/components/ui/KeyboardAwareScrollView` (has a `.web.tsx` fallback). It auto-scrolls the focused input above the keyboard with a native-synchronized animation on both platforms.
- Keep `keyboardShouldPersistTaps="handled"` so taps on buttons/dropdowns work while the keyboard is open.
- Tap-outside-to-dismiss: wrap the form in `TouchableWithoutFeedback onPress={Keyboard.dismiss}`.
- Do NOT use `KeyboardAvoidingView` with `behavior="height"` on Android.

### 2. Formularios en Modales / Diálogos (`DialogPrimitive.Portal`)
**REGLA DE ORO DE UX/UI MOBILE**: Los modales de acción (ej. `RegisterPaymentModal`, `SettleLoanModal`, `GuaranteeFormModal`) **NUNCA deben contraerse ni volverse scrolleables al abrir el teclado**, ya que reduce visualmente los componentes, genera barras de scroll feas y comprime el diseño.
- **Arquitectura**: `DialogOverlay` en `components/ui/dialog.tsx` aplica `useKeyboardTranslate(0.5)` vía Reanimated a 120 fps en el hilo de la UI.
- **Traslación Geométrica**: Al trasladar el modal hacia arriba exactamente $\frac{\text{alturaTeclado}}{2}$, el modal se mantiene geométricamente centrado en el espacio visible sobre el teclado sin contraerse.
- **Estructura del Cuerpo**: Usar un `<View className="gap-3 py-1">` (o `gap-4 py-2`) con altura natural. **NO usar `KeyboardAwareScrollView` ni `<ScrollView>` dentro de modales**, a menos que el formulario tenga más de 12 campos que excedan físicamente la pantalla vertical total.

## 🧹 Sanitización y Trimming de Inputs de Texto
- En formularios de autenticación (ej. `app/(auth)/login.tsx`), el campo `username` debe sanitizarse tanto en el cliente como en el backend:
  - **Cliente (Zod)**: Aplicar `.transform((val) => val.trim())` o `.trim()` en el schema Zod y un `.trim()` explícito en el handler `onSubmit` para eliminar espacios accidentales al inicio o final.
  - **Backend (NestJS)**: En los DTOs de autenticación (`LoginDto`), aplicar decoradores `@Transform(({ value }) => typeof value === 'string' ? value.trim() : value)` para garantizar que ningún espacio adicional genere fallas de autenticación.

## 📸 Carga de Imágenes Multipart/Form-Data (Fotos de Perfil y Garantías)
- **Tamaño Máximo**: Validar estrictamente un máximo de 20MB (`fileSize > 20 * 1024 * 1024`).
- **Cross-Platform Payload**:
  - **Web**: Convertir la URI en un `Blob` real mediante `fetch(uri).then(r => r.blob())` y enviarlo como `formData.append('photo', blob, 'photo.jpg')`.
  - **Native (iOS/Android)**: Adjuntar el objeto React Native `{ uri, name: 'photo.jpg', type: mimeType || 'image/jpeg' } as any`.
- **CRITICAL NestJS Multipart DTO Caveat**:
  - Cuando NestJS procesa `multipart/form-data` con `@UseInterceptors(FileInterceptor(...))`, todos los campos del body llegan como `string`.
  - Los campos numéricos en DTOs (ej. `latitude`, `longitude`, `estimatedValue`) **DEBEN** llevar el decorador `@Type(() => Number)` de `class-transformer` además de `@IsNumber()`. De lo contrario, `ValidationPipe` recibirá strings y rechazará las peticiones con HTTP 400 (`"latitude must be a number..."`).
- **Partial Updates (PATCH)**: En actualizaciones parciales, solo anexar el archivo `photo` si el usuario seleccionó una nueva imagen, o enviar `deletePhoto: true` / `photo: null` si el usuario eliminó la foto previa. Si no se modificó la foto, no enviar nada en el payload.

## 🗺️ Location Fields (latitude/longitude)

- `LocationPicker` (`components/ui/LocationPicker.tsx`) sets these fields via `onLocationSelect`.
- **Always round coordinates to 6 decimals before submitting** (`roundCoord` helper inside `LocationPicker`). The NestJS backend validates `@IsNumber({ maxDecimalPlaces: 8 })` on both `latitude` and `longitude`; raw map-tap coordinates have ~14 decimals and get rejected with HTTP 400.
- Reverse geocoding (`Location.reverseGeocodeAsync`) autofills the "Dirección de Cobro" address field via the `onAddressFound` callback — keep that wiring in `ClientForm`.

## 🌐 Web Compatibility & Click Interception
When using `TouchableWithoutFeedback` with `Keyboard.dismiss` to allow tapping outside to close the software keyboard on mobile:
- **Warning**: In web browsers, wrapping input containers with a root `TouchableWithoutFeedback` can sometimes capture and prevent standard browser focus click events, making inputs seem unclickable/unfocusable on Web.
- **Resolution**: Use platforms checks (`Platform.OS !== 'web'`) or ensure inputs are positioned on top of the press event layers, or write separate layouts if web forms exhibit focus bugs.

## 👁️ Password Input Pattern (Eye Toggle)
Password inputs should always feature an option to view or hide the text (especially useful on mobile to prevent typos).
- **Implementation**: Wrap the `Input` and a toggle button in a `<View className="relative">`.
- Set `secureTextEntry={!showPassword}` on the `Input`.
- Position the trigger button absolutely at the right end of the input box:
  ```tsx
  <View className="relative">
    <Input
      placeholder="••••••••"
      secureTextEntry={!showPassword}
      className="bg-background pr-12"
    />
    <Pressable
      onPress={() => setShowPassword(!showPassword)}
      className="absolute right-0 top-0 bottom-0 px-3 justify-center"
    >
      {showPassword ? (
        <Icon as={EyeOff} size={20} className="text-muted-foreground" />
      ) : (
        <Icon as={Eye} size={20} className="text-muted-foreground" />
      )}
    </Pressable>
  </View>
  ```

## 📅 Manual Date/Calendar Defaults & Validation
For forms requiring manual date picker inputs (e.g. customized installments):
- **Rule**: Initialize empty/unsaved date states as `null` rather than a blank string (`""`) or auto-populating "today's date".
- Using `null` forces React Hook Form and Zod to flag the field as incomplete, ensuring the user is explicitly required to interact with the date picker component and choose a date.
- Validate that all dynamic entries (like a list of installment dates) are non-null before enabling next/submit buttons.
- **Cuando SÍ se necesite inicializar con "hoy"** (ej. fecha de pago por defecto): usar `getTodayISO()` de `@/lib/format` (zona horaria local). NUNCA usar `new Date().toISOString().split('T')[0]` — la conversión UTC retrocede un día antes de las 04:00 en Bolivia (America/La_Paz, UTC-4), enviando fechas incorrectas al backend.

---

## 📋 Guarantee Form Pattern (Modal with Chip Selector)

The guarantee create/edit form (`components/client-detail/guarantees/GuaranteeFormModal.tsx`) demonstrates the pattern for quick-action forms rendered inside a **`Dialog`** modal instead of a full screen.

### When to use a modal form (vs. full screen)
- Use a modal when the entity has ≤ 4 fields and no complex nested data.
- Use a full screen (Expo Router push) for multi-step or complex flows.
- Los modales deben mantener una estructura sólida con `<View className="gap-3 py-1">` a su altura 100% natural. `DialogOverlay` se encarga de elevar el modal en pantalla al abrir el teclado mediante `useKeyboardTranslate(0.5)`. NUNCA usar `KeyboardAwareScrollView` dentro de portales, y evitar `ScrollView` a menos que sea un modal extraordinariamente largo.

### Chip Selector for Enum Fields
When a form field maps to a small fixed enum (e.g. `GuaranteeType`), prefer a **chip/pill selector** over a `<Select>` dropdown, as it is more intuitive on mobile:

```tsx
<Controller
  control={control}
  name="type"
  render={({ field: { value, onChange } }) => (
    <View className="flex-row flex-wrap gap-2">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={`px-3 py-2 rounded-xl border ${
              isSelected
                ? 'bg-secondary border-secondary'
                : 'bg-muted/50 border-border active:bg-muted'
            }`}
          >
            <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-foreground'}`}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  )}
/>
```

### Zod enum compatibility (Zod v4)
In Zod v4, `z.enum()` no longer accepts `required_error` in its options object. Pass the values tuple directly:
```ts
// ✅ Correct
type: z.enum(['VEHICLE', 'REAL_ESTATE', 'FURNITURE', 'OTHER']),

// ❌ Will throw TS error in Zod v4
type: z.enum(['VEHICLE', ...], { required_error: 'Select a type' }),
```

### Re-setting form values on modal open (create vs. edit)
Use a `useEffect` watching `[guaranteeToEdit, isOpen, reset]` to distinguish create mode (empty fields) from edit mode (pre-filled fields):
```ts
useEffect(() => {
  if (guaranteeToEdit) {
    reset({ type: guaranteeToEdit.type, description: guaranteeToEdit.description, ... });
  } else {
    reset({ type: 'VEHICLE', description: '', estimatedValue: '' });
  }
}, [guaranteeToEdit, isOpen, reset]);
```

