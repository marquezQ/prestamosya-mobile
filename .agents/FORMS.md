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
