// Mock logger implementation
const logger = {
  info: (...args: unknown[]) => console.log("[INFO]", ...args),
  error: (...args: unknown[]) => console.error("[ERROR]", ...args),
  warn: (...args: unknown[]) => console.warn("[WARN]", ...args),
  debug: (...args: unknown[]) => console.debug("[DEBUG]", ...args),
};

export default logger;

// Export the auth error logging function for convenience
export function logAuthError(
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
