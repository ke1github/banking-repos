# Validation Usage Examples

This document provides practical examples of how to use the validation system in the SP Banking App.

## Form Validation Examples

### Client-Side Form Validation

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInFormValues } from "@/lib/validations";

function SignInForm() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInFormValues) => {
    // Submit validated data
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p>{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...form.register("password")} />
        {form.formState.errors.password && (
          <p>{form.formState.errors.password.message}</p>
        )}
      </div>

      <button type="submit">Sign In</button>
    </form>
  );
}
```

### Server-Side Form Validation

```tsx
// In a server action file
"use server";

import { validateWithZod } from "@/lib/utils/validation-utils";
import { signInSchema } from "@/lib/validations";

export async function signInAction(formData: FormData) {
  try {
    // Convert FormData to plain object
    const rawData = Object.fromEntries(formData.entries());

    // Validate with Zod
    const validData = validateWithZod(signInSchema, rawData);

    // Proceed with authentication
    // ...

    return { success: true };
  } catch (error) {
    // Handle validation errors
    return {
      success: false,
      error: error.message || "Validation failed",
    };
  }
}
```

## Creating Custom Validation Schemas

### Extending Common Validations

```tsx
// In a new form validation file
import { z } from "zod";
import { CommonValidation } from "@/lib/utils/common-validations";

// Create a custom form schema
export const transferFormSchema = z.object({
  fromAccount: CommonValidation.accountNumber,
  toAccount: CommonValidation.accountNumber,
  amount: CommonValidation.amount,
  description: z.string().optional(),
  transferDate: z.date().optional(),
});

// Export the type
export type TransferFormValues = z.infer<typeof transferFormSchema>;
```

### Custom Field with Special Requirements

```tsx
import { z } from "zod";
import { CommonValidation } from "@/lib/utils/common-validations";

// Extend a common validation with additional constraints
const enhancedPasswordValidation = CommonValidation.password
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least one number",
  });

// Use in a schema
const adminSignUpSchema = z.object({
  email: CommonValidation.email,
  password: enhancedPasswordValidation,
  role: z.enum(["admin", "super_admin"]),
});
```

## Validation in React Components

### Using Validation with Custom Hooks

```tsx
// Custom hook for form handling
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormValues } from "@/lib/validations";

export function useSignUpForm() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    // Form submission logic
  };

  return {
    form,
    onSubmit,
  };
}

// In component
function SignUpForm() {
  const { form, onSubmit } = useSignUpForm();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>
  );
}
```

## Handling Validation Errors

### Displaying Error Messages

```tsx
import { ErrorMessage } from "@/components/ErrorMessage";

function FormField({ name, label, register, errors, type = "text" }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className={errors[name] ? "input-error" : ""}
      />
      {errors[name] && <ErrorMessage message={errors[name].message} />}
    </div>
  );
}
```

### Custom Error Handling

```tsx
import { ZodError } from "zod";
import { formatValidationErrors } from "@/lib/utils/validation-utils";

// Server action
export async function handleFormSubmission(formData: FormData) {
  try {
    // Validation logic
    // ...
  } catch (error) {
    if (error instanceof ZodError) {
      // Format Zod validation errors
      const formattedErrors = formatValidationErrors(error);
      return { success: false, errors: formattedErrors };
    }

    // Handle other errors
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
```

## Using Validation in API Routes

```tsx
// In an API route
import { NextRequest, NextResponse } from "next/server";
import { validateWithZod } from "@/lib/utils/validation-utils";
import { profileFormSchema } from "@/lib/validations";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validData = validateWithZod(profileFormSchema, body);

    // Update profile with validated data
    // ...

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
```
