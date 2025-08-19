/**
 * Consolidated logging system
 * This file contains the core logging functionality shared between client and server
 */

import { LogLevel, LogData, Logger } from "./logger-core";

// Configure the minimum log level based on the environment
export const MIN_LOG_LEVEL =
  process.env.NODE_ENV === "production" ? LogLevel.WARN : LogLevel.DEBUG;

// Helper function to safely stringify objects for logging
export const safeStringify = (obj: unknown): string => {
  try {
    return JSON.stringify(
      obj,
      (key, value) => {
        if (value instanceof Error) {
          const errorObject: Record<string, unknown> = {
            name: value.name,
            message: value.message,
            stack: value.stack,
          };

          // Add any custom properties from the error
          for (const prop in value) {
            if (Object.prototype.hasOwnProperty.call(value, prop)) {
              errorObject[prop] = (value as unknown as Record<string, unknown>)[
                prop
              ];
            }
          }

          return errorObject;
        }
        return value;
      },
      2
    );
  } catch (e) {
    return `[Unstringifiable Object: ${String(e)}]`;
  }
};

// Function to format log metadata
export const formatMetadata = (meta?: Record<string, unknown>): string => {
  if (!meta || Object.keys(meta).length === 0) return "";
  return `\nMetadata: ${safeStringify(meta)}`;
};

// Optional: remote logging service integration
// Replace with your actual error logging service in production
export const sendToRemoteLogging = async (
  level: string,
  message: string,
  data?: LogData
) => {
  if (process.env.NODE_ENV === "production") {
    try {
      // Example remote logging - Replace with your actual service implementation
      // This could be a call to Sentry, LogRocket, Application Insights, etc.

      // For Sentry-like services:
      // Sentry.captureException(data.error);

      // For general purpose logging:
      console.log(
        `[REMOTE LOG] ${level}: ${message}`,
        data ? safeStringify(data) : ""
      );

      // Simulate API call to logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ level, message, data }),
      // });
    } catch (err) {
      // If remote logging fails, fall back to console
      console.error("Remote logging failed:", err);
    }
  }
};

// Create a base logger implementation that can be used in both client and server
export function createBaseLogger(prefix: string): Logger {
  return {
    debug(message: string, ...args: unknown[]) {
      if (LogLevel.DEBUG >= MIN_LOG_LEVEL) {
        console.debug(`[${prefix}] [DEBUG] ${message}`, ...args);
      }
    },

    info(message: string, ...args: unknown[]) {
      if (LogLevel.INFO >= MIN_LOG_LEVEL) {
        console.info(`[${prefix}] [INFO] ${message}`, ...args);
      }
    },

    warn(message: string, error?: unknown, meta?: Record<string, unknown>) {
      if (LogLevel.WARN >= MIN_LOG_LEVEL) {
        console.warn(`[${prefix}] [WARN] ${message}`, error, meta);
        void sendToRemoteLogging("WARN", message, { error, ...meta });
      }
    },

    error(message: string, error?: unknown, meta?: Record<string, unknown>) {
      if (LogLevel.ERROR >= MIN_LOG_LEVEL) {
        console.error(`[${prefix}] [ERROR] ${message}`, error);
        if (meta) {
          console.error(`Error metadata: ${safeStringify(meta)}`);
        }
        void sendToRemoteLogging("ERROR", message, { error, ...meta });
      }
    },

    authError(
      message: string,
      error?: unknown,
      meta?: Record<string, unknown>
    ) {
      if (LogLevel.ERROR >= MIN_LOG_LEVEL) {
        console.error(`[${prefix}] [AUTH ERROR] ${message}`, error);
        if (meta) {
          console.error(`Auth error metadata: ${safeStringify(meta)}`);
        }
        void sendToRemoteLogging("AUTH_ERROR", message, { error, ...meta });
      }
    },
  };
}
