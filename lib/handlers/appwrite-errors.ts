/**
 * Extended Appwrite error handling with improved codes and translations
 * This module is designed to work in both client and server environments
 *
 * DEPRECATED - use error-handler.ts instead.
 * This file is kept for backward compatibility and will be removed in a future version.
 */

import { AppwriteException } from "appwrite";
import { AppError, ErrorCode } from "../utils/error-utils";
import { handleAppwriteError } from "./error-handler";

// Re-export the handleAppwriteError function from error-handler.ts
export { handleAppwriteError };

/**
 * Helper function to generate an appropriate session expiry error
 * Used when we detect session problems client-side
 */
export function createSessionExpiredError(): AppError {
  return new AppError(
    ErrorCode.SESSION_EXPIRED,
    "User session has expired",
    "Your session has expired. Please log in again to continue."
  );
}

/**
 * Helper function to check if an error is related to an expired session
 * Use this to detect auth expiry issues and trigger relogin flows
 */
export function isSessionExpiredError(error: unknown): boolean {
  if (error instanceof AppwriteException) {
    return (
      error.type === "user_session_expired" ||
      error.type === "user_invalid_token" ||
      error.type === "user_jwt_invalid" ||
      error.type === "user_missing_scope" ||
      error.message.includes("missing scope (account)") ||
      error.code === 401
    );
  }

  if (error instanceof AppError) {
    return (
      error.code === ErrorCode.SESSION_EXPIRED ||
      error.code === ErrorCode.AUTHENTICATION_FAILED
    );
  }

  return false;
}

/**
 * This function is deprecated and will be removed in a future version
 * Use handleAppwriteError from error-handler.ts instead
 */
export function translateAppwriteError(
  error: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fallbackMessage?: string
): AppError {
  console.warn(
    "translateAppwriteError is deprecated, use handleAppwriteError instead"
  );
  // Ignore the additional parameters for compatibility
  return handleAppwriteError(error);
}
