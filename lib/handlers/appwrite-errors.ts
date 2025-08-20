/**
 * Utility functions to handle Appwrite-specific errors
 */

import { AppwriteException } from "appwrite";

/**
 * Check if an error is related to an expired session
 */
export function isSessionExpiredError(error: unknown): boolean {
  // Return false for non-Appwrite errors
  if (!(error instanceof AppwriteException)) {
    return false;
  }

  // Appwrite session expired error code is 401
  if (error.code === 401) {
    return true;
  }

  // Sometimes error message contains 'Session' and 'expired'
  if (
    error.message &&
    error.message.toLowerCase().includes("session") &&
    error.message.toLowerCase().includes("expired")
  ) {
    return true;
  }

  return false;
}

/**
 * Check if an error is related to authentication
 */
export function isAuthError(error: unknown): boolean {
  // Return false for non-Appwrite errors
  if (!(error instanceof AppwriteException)) {
    return false;
  }

  // Appwrite auth-related error codes
  const authErrorCodes = [401, 403];

  return authErrorCodes.includes(error.code);
}

/**
 * Get a user-friendly message from an Appwrite error
 */
export function getAppwriteErrorMessage(error: unknown): string {
  if (!(error instanceof AppwriteException)) {
    return "An unexpected error occurred";
  }

  // Return the message from Appwrite if available
  if (error.message) {
    return error.message;
  }

  // Fallback messages based on error code
  switch (error.code) {
    case 401:
      return "Authentication failed. Please log in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "A conflict occurred. The resource might already exist.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
    case 501:
    case 502:
    case 503:
      return "Server error. Please try again later.";
    default:
      return "An error occurred. Please try again.";
  }
}
