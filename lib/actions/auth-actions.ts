"use server";

import { ROUTES } from "@/constants/route";
import { revalidatePath } from "next/cache";
import logger from "@/lib/utils/mock-logger";
import { z } from "zod";

// Helper function to log auth errors
function logAuthError(
  error: unknown,
  context: string,
  metadata: Record<string, unknown> = {}
) {
  logger.error(
    {
      error: error instanceof Error ? error.message : String(error),
      ...metadata,
      context,
    },
    `Auth error: ${context}`
  );
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional().default(false),
});

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
});

const resetRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    secret: z.string().min(1, "Secret is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Login action
 */
export async function loginAction(data: z.infer<typeof loginSchema>) {
  try {
    // Validate input
    const validatedData = loginSchema.parse(data);

    // Log login attempt for debugging
    console.log(`Login attempt for ${validatedData.email}`);

    // Mock successful login
    revalidatePath(ROUTES.HOME);

    return {
      success: true,
      sessionId: "mock-session-id",
    };
  } catch (error) {
    logAuthError(error, "login_action", { email: data.email });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to login",
    };
  }
}

/**
 * Register action
 */
export async function registerAction(data: z.infer<typeof registerSchema>) {
  try {
    // Validate input
    const validatedData = registerSchema.parse(data);

    // Log registration attempt for debugging
    console.log(`Registration attempt for ${validatedData.email}`);

    // Mock successful registration
    revalidatePath(ROUTES.HOME);

    return {
      success: true,
      userId: "mock-user-id",
    };
  } catch (error) {
    logAuthError(error, "register_action", { email: data.email });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register",
    };
  }
}

/**
 * Logout action
 */
export async function logoutAction() {
  try {
    // Mock logout
    revalidatePath(ROUTES.HOME);

    return { success: true };
  } catch (error) {
    logAuthError(error, "logout_action");

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to logout",
    };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordResetAction(
  data: z.infer<typeof resetRequestSchema>
) {
  try {
    // Validate input
    const validatedData = resetRequestSchema.parse(data);

    // Log password reset request for debugging
    console.log(`Password reset request for ${validatedData.email}`);

    // Mock successful password reset request
    return { success: true };
  } catch (error) {
    logAuthError(error, "request_password_reset_action", { email: data.email });

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to request password reset",
    };
  }
}

/**
 * Complete password reset
 */
export async function resetPasswordAction(
  data: z.infer<typeof resetPasswordSchema>
) {
  try {
    // Validate input
    const validatedData = resetPasswordSchema.parse(data);

    // Log password reset attempt for debugging
    console.log(`Password reset attempt for user ${validatedData.userId}`);

    // Mock successful password reset
    return { success: true };
  } catch (error) {
    logAuthError(error, "reset_password_action");

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reset password",
    };
  }
}
