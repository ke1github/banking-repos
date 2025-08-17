import { z } from "zod";
import {
  createValidationError,
  ValidationError,
  ErrorCode,
  AppError,
} from "./error-utils";

/**
 * Validate data using a Zod schema and return validation errors
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns The validated data or throws a validation error
 */
export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationError[] = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw createValidationError(validationErrors);
    }

    // If not a ZodError, re-throw
    throw error;
  }
}

/**
 * Validate data using a Zod schema and return validation errors as an object
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Object with success flag, validated data, and errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  error?: AppError;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationError[] = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return {
        success: false,
        errors: validationErrors,
        error: new AppError(
          ErrorCode.VALIDATION_ERROR,
          `Validation failed: ${validationErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`,
          "Please fix the errors in the form and try again."
        ),
      };
    }

    // For other errors
    return {
      success: false,
      error: new AppError(
        ErrorCode.UNKNOWN_ERROR,
        error instanceof Error ? error.message : "Unknown validation error",
        "An error occurred while validating your input."
      ),
    };
  }
}

/**
 * Common validation schemas
 */
export const ValidationSchemas = {
  // User validation schemas
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),

  name: z.string().min(2, "Name must be at least 2 characters long"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-\s()]{10,15}$/, "Please enter a valid phone number"),

  // Banking validation schemas
  amount: z
    .number()
    .min(0.01, "Amount is required")
    .positive("Amount must be positive"),

  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .regex(/^[0-9]{8,17}$/, "Please enter a valid account number"),

  routingNumber: z
    .string()
    .min(1, "Routing number is required")
    .regex(/^[0-9]{9}$/, "Please enter a valid 9-digit routing number"),

  // Form schemas
  loginForm: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
  }),

  registrationForm: z
    .object({
      firstName: z
        .string()
        .min(2, "First name must be at least 2 characters long"),
      lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters long"),
      middleName: z.string().optional(),
      email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),

  transferForm: z
    .object({
      fromAccountId: z.string().min(1, "From account is required"),
      toAccountId: z.string().min(1, "To account is required"),
      amount: z
        .number()
        .min(0.01, "Amount is required")
        .positive("Amount must be positive"),
      description: z.string().optional(),
    })
    .refine((data) => data.fromAccountId !== data.toAccountId, {
      message: "From and to accounts cannot be the same",
      path: ["toAccountId"],
    }),
};

/**
 * Type definitions for form data
 */
export type LoginFormData = z.infer<typeof ValidationSchemas.loginForm>;
export type RegistrationFormData = z.infer<
  typeof ValidationSchemas.registrationForm
>;
export type TransferFormData = z.infer<typeof ValidationSchemas.transferForm>;
