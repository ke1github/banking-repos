"use client";

import {
  // Uncomment these types if you need them later
  // LogLevel,
  // LogData,
  isGuestScopeError as coreIsGuestScopeError,
} from "./logger-core";
import {
  createBaseLogger,
  // Uncomment if you need this later
  // sendToRemoteLogging
} from "./logger-implementation";

// Errors we shouldn't log in detail for authenticated users
const EXPECTED_GUEST_ERRORS = [
  "User (role: guests) missing scope (account)",
  "missing scope (account)",
  "user_missing_scope",
];

// Check if an error is an expected guest scope error
// Enhanced version of the core function with additional checks
export function isGuestScopeError(error: unknown): boolean {
  // First use the core implementation
  if (coreIsGuestScopeError(error)) return true;

  if (!error) return false;

  const errorStr =
    typeof error === "string"
      ? error
      : error instanceof Error
      ? error.message
      : String(error);

  return EXPECTED_GUEST_ERRORS.some((msg) => errorStr.includes(msg));
}

// Main application logger
export const logger = createBaseLogger("APP");

// Export a function to enable structured logging throughout the app
export function logError(
  error: unknown,
  context?: string,
  meta?: Record<string, unknown>
) {
  const message = error instanceof Error ? error.message : String(error);
  const contextPrefix = context ? `[${context}] ` : "";
  logger.error(`${contextPrefix}${message}`, error, meta);
}

// Export a function for auth-specific errors
export function logAuthError(
  error: unknown,
  operation: string,
  meta?: Record<string, unknown>
) {
  // Skip detailed logging for expected guest scope errors in normal operations
  if (
    isGuestScopeError(error) &&
    (!meta || !meta.forceLog) &&
    operation !== "unexpected_error"
  ) {
    // Only log these at debug level since they're expected for guests
    logger.debug(`Guest scope error in ${operation} (expected)`);
    return;
  }

  const message = error instanceof Error ? error.message : String(error);

  logger.authError(`Failed during ${operation}: ${message}`, error, {
    operation,
    timestamp: new Date().toISOString(),
    ...meta,
  });
}
