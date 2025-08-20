/**
 * Error interceptor for guest scope errors
 * This is useful for development to catch and log errors
 */

// Use a simple error logger
const logError = (error: Error | unknown, context?: string) => {
  if (context) {
    console.error(`[Error: ${context}]`, error);
  } else {
    console.error("[Error]", error);
  }
};

/**
 * Install an error interceptor to catch and log uncaught errors
 */
export function installErrorInterceptor() {
  // Store the original console.error to restore it later if needed
  const originalConsoleError = console.error;

  // Override console.error to intercept and log errors
  console.error = function (...args) {
    // Log the error to our logger
    try {
      const error = args[0];
      if (error instanceof Error) {
        logError(error, "console_error_interceptor");
      } else if (typeof error === "string" && error.includes("Error:")) {
        logError(error, "console_error_interceptor");
      }
    } catch (e) {
      // If our logging fails, don't break the original console.error
      originalConsoleError("Error in error interceptor:", e);
    }

    // Call the original console.error with all arguments
    originalConsoleError.apply(console, args);
  };

  // Add a global error handler for uncaught exceptions
  window.addEventListener("error", (event) => {
    logError(event.error || event.message, "window_error_event");
  });

  // Add a global handler for unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    logError(event.reason, "unhandled_promise_rejection");
  });

  // Return a function to remove the interceptor if needed
  return function removeInterceptor() {
    console.error = originalConsoleError;
    window.removeEventListener("error", (event) => {
      logError(event.error || event.message, "window_error_event");
    });
    window.removeEventListener("unhandledrejection", (event) => {
      logError(event.reason, "unhandled_promise_rejection");
    });
  };
}
