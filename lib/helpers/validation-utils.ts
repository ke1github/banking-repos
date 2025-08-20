import { z } from "zod";

/**
 * Validates data against a Zod schema
 * Returns the validated data or throws an error with validation messages
 */
export function validateWithZod<T>(
  schema: z.ZodType<T>,
  data: unknown,
  options: { message?: string } = {}
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format error messages
      const errorMessages = error.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));

      // Create a single error message combining all validation errors
      const formattedMessage = errorMessages
        .map((err) => `${err.path}: ${err.message}`)
        .join("; ");

      throw new Error(
        options.message || `Validation error: ${formattedMessage}`
      );
    }

    // Re-throw other errors
    throw error;
  }
}
