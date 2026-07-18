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
