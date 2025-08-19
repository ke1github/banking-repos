"use client";

/**
 * Global error interceptor for Appwrite errors
 * This intercepts console errors in development to suppress common guest scope errors
 * that would otherwise clutter the console and cause confusion
 */

import { isGuestScopeError } from "./logger";

// Track the original console methods
let originalError: typeof console.error | null = null;
let isInterceptorInstalled = false;

/**
 * Installs the error interceptor that silences guest scope errors
 * Only runs in client-side code and non-production environments
 */
export function installErrorInterceptor() {
  // Only run once
  if (isInterceptorInstalled) return;

  // Only run in browser and non-production
  if (typeof window === "undefined" || process.env.NODE_ENV === "production")
    return;

  // Save original console.error
  originalError = console.error;

  // Override console.error
  console.error = function (...args) {
    // Convert args to string for pattern matching
    const errorStr = args.join(" ");

    // Check if this is a filtered error using the shared utility
    if (isGuestScopeError(errorStr)) {
      // Replace with a cleaner debug message
      console.debug("[Auth] Guest scope error suppressed in console");
      return;
    }

    // Pass through to original implementation
    if (originalError) {
      originalError.apply(console, args);
    }
  };

  isInterceptorInstalled = true;
}

/**
 * Removes the error interceptor and restores original console behavior
 * Call this in test environments if needed
 */
export function removeErrorInterceptor() {
  if (!isInterceptorInstalled || !originalError) return;

  console.error = originalError;
  isInterceptorInstalled = false;
}

// Auto-install in client environments
if (typeof window !== "undefined") {
  installErrorInterceptor();
}
