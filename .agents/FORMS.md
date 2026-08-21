# Forms & Validation Context

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

**Standard**: use `react-native-keyboard-controller` (bundled in Expo Go SDK 54, no dev build needed):
- `KeyboardProvider` must wrap the app — **already mounted in `app/_layout.tsx`**. Without it, `KeyboardAwareScrollView` logs `Couldn't find real values for KeyboardContext` and silently does nothing.
- Wrap scrollable forms in `KeyboardAwareScrollView` from `@/components/ui/KeyboardAwareScrollView` (has a `.web.tsx` fallback). It auto-scrolls the focused input above the keyboard with a native-synchronized animation on both platforms.
- Keep `keyboardShouldPersistTaps="handled"` so taps on buttons/dropdowns work while the keyboard is open.
- Tap-outside-to-dismiss: wrap the form in `TouchableWithoutFeedback onPress={Keyboard.dismiss}`.
- Do NOT use `KeyboardAvoidingView` with `behavior="height"` on Android.

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
- Para forms que necesitan scroll dentro del `DialogContent` (ej. `RegisterPaymentModal`), envolver el cuerpo en un `<ScrollView keyboardShouldPersistTaps="handled">` — NO usar `KeyboardAwareScrollView` dentro de portales.

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

