# Validation System

This document explains the consolidated validation system for the SP Banking App.

## Overview

The validation system has been restructured to eliminate duplication and provide consistent validation rules across the application.

## Files

1. **`lib/utils/common-validations.ts`**

   - Contains reusable validation schemas
   - Single source of truth for validation rules
   - Exports `CommonValidation` object with standardized validation schemas

2. **`lib/validations.ts`**

   - Contains form-specific validation schemas
   - Uses `CommonValidation` for field-level validation
   - Exports complete form schemas and their TypeScript types

3. **`lib/utils/validation-utils.ts`**
   - Contains utilities for validation
   - Implements `validateWithZod` and `validateData` for consistent error handling
   - Used internally by server actions

## How to Use

### For Form Validation

Import validation schemas from `lib/validations.ts`:

```typescript
import {
  signInSchema,
  signUpSchema,
  profileFormSchema,
} from "@/lib/validations";
import { SignInFormValues } from "@/lib/validations"; // Type imports
```

### For Individual Field Validation

Import common validations:

```typescript
import { CommonValidation } from "@/lib/utils/common-validations";

// Example usage in a custom schema
const mySchema = z.object({
  email: CommonValidation.email,
  name: CommonValidation.name,
  // other fields...
});
```

### For Server-Side Validation

```typescript
import { validateWithZod } from "@/lib/utils/validation-utils";
import { signInSchema } from "@/lib/validations";

// In a server action
export async function loginAction(formData: unknown) {
  try {
    // Validates and returns typed data or throws
    const validData = validateWithZod(signInSchema, formData);

    // Proceed with valid data
    return { success: true };
  } catch (error) {
    // Handle validation errors
    return { success: false, error };
  }
}
```

## Benefits

1. **Consistency**: All validation rules come from a single source
2. **Maintainability**: Changes to validation rules only need to be made in one place
3. **Type Safety**: TypeScript types are automatically derived from schemas
4. **Reusability**: Common validations can be composed into more complex schemas
5. **Error Handling**: Standardized error messages and formats
