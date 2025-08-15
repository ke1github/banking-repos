# Authentication Components

This directory contains reusable components for building authentication flows in the banking application.

## Component Structure

The authentication system has been refactored into multiple smaller, reusable components:

1. **FormFields.tsx** - Contains reusable form field components:

   - `TextField` - Standard input field with icons and validation
   - `PasswordField` - Password input with toggle visibility
   - `CheckboxField` - Checkbox component for terms, etc.

2. **FormComponents.tsx** - Contains layout components:

   - `FormStep` - Container for each step in multi-step forms
   - `StepIndicator` - Visualization of steps progress
   - `FormNavigation` - Next/Back buttons for multi-step forms
   - `FormContainer` - Wrapper for forms with consistent styling

3. **useAuthForm.ts** - Custom hook that contains form logic:

   - Form state management (using react-hook-form)
   - Form validation (using zod)
   - Step navigation for multi-step forms
   - Form submission handling
   - Error state management

4. **AuthForm.tsx** - Main authentication component that uses all the above components to create:
   - Sign-in form with email/password
   - Sign-up form with multi-step process (personal, address, financial information)

## Usage

### Sign-in Form

```tsx
import { AuthForm } from "@/components/auth/AuthForm";
import { SignInFormValues } from "@/lib/validations";

const SignInPage = () => {
  const handleSignIn = (data: SignInFormValues) => {
    console.log("Sign in data:", data);
    // Handle authentication logic
  };

  return <AuthForm mode="signin" onSubmit={handleSignIn} />;
};
```

### Sign-up Form

```tsx
import { AuthForm } from "@/components/auth/AuthForm";
import { SignUpFormValues } from "@/lib/validations";

const SignUpPage = () => {
  const handleSignUp = (data: SignUpFormValues) => {
    console.log("Sign up data:", data);
    // Handle registration logic
  };

  return <AuthForm mode="signup" onSubmit={handleSignUp} />;
};
```

## Validation

Form validation is handled through Zod schemas defined in `lib/validations.ts`:

- `signInSchema`: Validates email, password, and remember me
- `signUpSchema`: Validates all fields for the multi-step sign-up process

## Styling

All components use Tailwind CSS for styling, with consistent color schemes and spacing. Form fields include proper error states and focus styles.

## Best Practices

1. **Separation of Concerns**:

   - UI components are separate from form logic
   - Validation schemas are centralized
   - Hooks handle complex state management

2. **Reusability**:

   - Field components are reusable across different forms
   - The same form components can be used for other forms in the application

3. **Accessibility**:

   - Proper labels and aria attributes
   - Keyboard navigation support
   - Clear error messages

4. **Type Safety**:
   - TypeScript interfaces for all components
   - Zod schemas generate types for form values
