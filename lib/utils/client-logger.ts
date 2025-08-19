"use client";

import { Logger, isGuestScopeError } from "./logger-core";
import { createBaseLogger } from "./logger-implementation";

// Create a client-side logger instance
export const clientLogger: Logger = createBaseLogger("CLIENT");

/**
 * Log an authentication error (client-side)
 */
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
    clientLogger.debug(`Guest scope error in ${operation} (expected)`);
    return;
  }

  const message = error instanceof Error ? error.message : String(error);

  clientLogger.authError(`Failed during ${operation}: ${message}`, error, {
    operation,
    timestamp: new Date().toISOString(),
    ...meta,
  });
}
