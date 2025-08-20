"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/route";
import logger from "@/lib/utils/mock-logger";

// Mock user type that mimics Appwrite Models.User
type MockUser = {
  $id: string;
  name: string;
  email: string;
  preferences: Record<string, unknown>;
  $createdAt: string;
  $updatedAt: string;
};

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

// In-memory storage for mock authentication
const MOCK_USER: MockUser = {
  $id: "mock-user-id",
  name: "Test User",
  email: "test@example.com",
  preferences: {},
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
};

let isAuthenticated = false; // This will be modified by login/logout functions

/**
 * Get the current authenticated user
 */
export async function getUserData(): Promise<MockUser | null> {
  // Return the mock user if authenticated
  if (isAuthenticated) {
    return MOCK_USER;
  }
  return null;
}

/**
 * Check if a user is currently authenticated
 */
export async function isLoggedIn(): Promise<boolean> {
  return isAuthenticated;
}

/**
 * Authenticate a user with email and password
 */
export async function login(
  email: string,
  password: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remember = false
): Promise<{
  success: boolean;
  sessionId?: string;
  error?: string;
}> {
  try {
    // For mock implementation, we'll accept any credentials
    // In a real app, you would validate credentials
    isAuthenticated = true;

    // Revalidate paths dependent on authentication
    revalidatePath(ROUTES.HOME);

    return {
      success: true,
      sessionId: "mock-session-id",
    };
  } catch (error) {
    logAuthError(error, "login", { email });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to login",
    };
  }
}

/**
 * Register a new user
 */
export async function register(
  email: string,
  password: string,
  name: string
): Promise<{
  success: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    // For mock implementation, we'll pretend registration succeeded
    // In a real app, you would create a new user
    isAuthenticated = true;

    // Update the mock user with the provided details
    MOCK_USER.name = name;
    MOCK_USER.email = email;
    MOCK_USER.$updatedAt = new Date().toISOString();

    // Revalidate paths dependent on authentication
    revalidatePath(ROUTES.HOME);

    return {
      success: true,
      userId: MOCK_USER.$id,
    };
  } catch (error) {
    logAuthError(error, "register", { email });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register",
    };
  }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // For mock implementation, simply set isAuthenticated to false
    isAuthenticated = false;

    // Revalidate paths dependent on authentication
    revalidatePath(ROUTES.HOME);

    return { success: true };
  } catch (error) {
    logAuthError(error, "logout");

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to logout",
    };
  }
}

/**
 * Request a password reset
 */
export async function requestPasswordReset(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // For mock implementation, pretend we sent an email
    console.log(`[MOCK] Password reset requested for ${email}`);

    return { success: true };
  } catch (error) {
    logAuthError(error, "request_password_reset", { email });

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
 * Complete a password reset
 */
export async function completePasswordReset(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  secret: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  password: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // For mock implementation, pretend the password was reset
    console.log(`[MOCK] Password reset completed for user ${userId}`);

    return { success: true };
  } catch (error) {
    logAuthError(error, "complete_password_reset");

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reset password",
    };
  }
}
