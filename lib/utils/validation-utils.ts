import { z } from "zod";
import { ValidationError, ErrorCode, AppError } from "./error-utils";
import { createValidationError } from "./error-handler";

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
