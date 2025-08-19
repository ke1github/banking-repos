/**
 * Shared logger types and utilities
 * This file contains shared interfaces and types but no implementation
 */

// Define log levels for different environments
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

// Define a type for log data
export interface LogData {
  error?: unknown;
  [key: string]: unknown;
}

// Common interface for any logger implementation
export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, error?: unknown, meta?: Record<string, unknown>): void;
  error(message: string, error?: unknown, meta?: Record<string, unknown>): void;
  authError(
    message: string,
    error?: unknown,
    meta?: Record<string, unknown>
  ): void;
}

// Auth error logging interface
export interface AuthErrorLogger {
  (error: unknown, operation: string, meta?: Record<string, unknown>): void;
}

// Helper to check if an error is an Appwrite guest scope error
export function isGuestScopeError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  // Check for Appwrite error format
  const appwriteError = error as {
    type?: string;
    code?: number;
    message?: string;
  };

  return (
    appwriteError.type === "general_unauthorized_scope" ||
    appwriteError.code === 401 ||
    (typeof appwriteError.message === "string" &&
      appwriteError.message.includes("missing scope"))
  );
}
