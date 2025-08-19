"use client";

// Import the updated version that accepts context parameters
import { translateAppwriteError } from "@/lib/utils/appwrite-errors";
import { logAuthError } from "@/lib/utils/client-logger";
import { account } from "@/lib/appwrite/config";
import { AppwriteException, ID } from "appwrite";

/**
 * Helper for handling Appwrite operations with standardized error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  metadata: Record<string, unknown> = {}
): Promise<{ success: true; result: T } | { success: false; error: string }> {
  try {
    const result = await operation();
    return { success: true, result };
  } catch (error) {
    // Translate error to a consistent format
    const translatedError = translateAppwriteError(error);

    // Add additional specific handling for common issues
    let userMessage = translatedError.userMessage;

    // Handle specific cases with more helpful messages
    if (error instanceof Error) {
      if (error.message?.includes("Invalid `userId` param")) {
        userMessage =
          "There was a problem with your account ID. Please try again or contact support.";
      } else if (error.message?.includes("Invalid credentials")) {
        userMessage =
          "The email or password you entered is incorrect. Please try again.";
      }
    }

    // Log the error
    logAuthError(error, context, {
      ...metadata,
      errorCode: translatedError.code,
    });

    return {
      success: false,
      error: userMessage,
    };
  }
}

/**
 * Try to get the current session, returning null on failure
 */
export async function tryGetSession() {
  try {
    return await account.getSession("current");
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 401) {
      // This is expected when not logged in
      return null;
    }

    // Log unexpected errors
    logAuthError(error, "get_session", { unexpected: true });
    return null;
  }
}

/**
 * Try to get the user account, returning null on failure
 */
export async function tryGetUser() {
  try {
    return await account.get();
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 401) {
      // This is expected when not logged in
      return null;
    }

    // Log unexpected errors
    logAuthError(error, "get_user", { unexpected: true });
    return null;
  }
}

/**
 * Create an email session (login)
 */
export async function createSession(email: string, password: string) {
  return await withErrorHandling(
    () => account.createSession(email, password),
    "login",
    { email }
  );
}

/**
 * Create a new user account
 */
export async function createUser(
  email: string,
  password: string,
  name: string
) {
  return await withErrorHandling(
    () => account.create(ID.unique(), email, password, name),
    "register",
    { email }
  );
}

/**
 * Delete the current session (logout)
 */
export async function deleteSession() {
  return await withErrorHandling(
    () => account.deleteSession("current"),
    "logout"
  );
}

/**
 * Delete all sessions for this user (logout everywhere)
 */
export async function deleteAllSessions() {
  return await withErrorHandling(() => account.deleteSessions(), "logout_all");
}

/**
 * Get JWT token for the current session
 */
export async function getJWT() {
  return await withErrorHandling(() => account.createJWT(), "create_jwt");
}

/**
 * Update the current user's name
 */
export async function updateName(name: string) {
  return await withErrorHandling(
    () => account.updateName(name),
    "update_name",
    { name }
  );
}

/**
 * Update the current user's password
 */
export async function updatePassword(password: string, oldPassword: string) {
  return await withErrorHandling(
    () => account.updatePassword(password, oldPassword),
    "update_password"
  );
}

/**
 * Verify session and reload it if needed (refreshes JWT)
 */
export async function verifySession() {
  return await withErrorHandling(
    () => account.getSession("current"),
    "verify_session"
  );
}
