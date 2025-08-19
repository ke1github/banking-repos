/**
 * Server-side logger functions
 */

import { Logger, isGuestScopeError } from "./logger-core";
import { createBaseLogger } from "./logger-implementation";

// Create a server-side logger instance
export const serverLogger: Logger = createBaseLogger("SERVER");

/**
 * Log an authentication error on the server side
 */
export function logServerAuthError(
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
    serverLogger.debug(`Guest scope error in ${operation} (expected)`);
    return;
  }

  const message = error instanceof Error ? error.message : String(error);

  serverLogger.authError(`Failed during ${operation}: ${message}`, error, {
    operation,
    timestamp: new Date().toISOString(),
    ...meta,
  });
}
