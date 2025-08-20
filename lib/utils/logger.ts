// Export a basic error logging function
export const logError = (error: Error | unknown, context?: string) => {
  if (context) {
    console.error(`[Error: ${context}]`, error);
  } else {
    console.error("[Error]", error);
  }
};

// Export basic auth error logging function
export const logAuthError = (
  error: unknown,
  context: string,
  metadata: Record<string, unknown> = {}
) => {
  console.error(`[Auth Error: ${context}]`, {
    error: error instanceof Error ? error.message : String(error),
    ...metadata,
    context,
  });
};

// Basic logger interface
const logger = {
  info: (message: unknown, ...args: unknown[]) =>
    console.log("[INFO]", message, ...args),
  error: (message: unknown, ...args: unknown[]) =>
    console.error("[ERROR]", message, ...args),
  warn: (message: unknown, ...args: unknown[]) =>
    console.warn("[WARN]", message, ...args),
  debug: (message: unknown, ...args: unknown[]) =>
    console.debug("[DEBUG]", message, ...args),
};

export default logger;
