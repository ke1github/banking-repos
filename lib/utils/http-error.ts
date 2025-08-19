/**
 * HTTP error handling utilities
 *
 * DEPRECATED - use error-handler.ts instead.
 * This file is kept for backward compatibility and will be removed in a future version.
 */
import { AppError, ErrorCode } from "./error-utils";
import { logError } from "./logger";
import {
  HTTP_STATUS as HANDLER_HTTP_STATUS,
  createHttpError as handlerCreateHttpError,
} from "./error-handler";

// Re-export HTTP_STATUS from error-handler.ts
export const HTTP_STATUS = HANDLER_HTTP_STATUS;

/**
 * Custom HTTP error class for better error handling
 * This is kept for backward compatibility
 */
export class HttpError extends AppError {
  status: number;

  constructor(
    status: number,
    code: ErrorCode,
    message: string,
    userMessage?: string
  ) {
    super(code, message, userMessage);
    this.status = status;
    this.name = "HttpError";
  }
}

/**
 * Create an HttpError based on status code
 * DEPRECATED - use createHttpError from error-handler.ts instead
 */
export function createHttpError(status: number, message?: string): HttpError {
  const handlerError = handlerCreateHttpError(status, message);
  return new HttpError(
    handlerError.status,
    handlerError.code,
    handlerError.message,
    handlerError.userMessage
  );
}

/**
 * Helper for making HTTP requests with proper error handling
 */
async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw createHttpError(response.status, response.statusText);
    }

    // Check Content-Type for JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        return await response.json();
      } catch (jsonError) {
        logError(jsonError, "JSON Parse", { url });
        throw createHttpError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Failed to parse JSON response"
        );
      }
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      // Return as text in a compatible format
      return { text } as unknown as T;
    }
  } catch (error) {
    // Check if already an HttpError
    if (error instanceof HttpError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      logError(error, "HTTP Fetch", { url, options });
      throw new HttpError(
        0, // Status code 0 for network errors
        ErrorCode.NETWORK_ERROR,
        `Network error while fetching ${url}: ${error.message}`,
        "A network error occurred. Please check your internet connection and try again."
      );
    }

    // Log and rethrow other errors
    logError(error, "HTTP Fetch", { url, options });
    throw error;
  }
}

/**
 * Helper for making common HTTP requests with error handling
 */
export const httpClient = {
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchWithErrorHandling<T>(url, {
      method: "GET",
      ...options,
    });
  },

  async post<T, D = unknown>(
    url: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    return fetchWithErrorHandling<T>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  async put<T, D = unknown>(
    url: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    return fetchWithErrorHandling<T>(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  async patch<T, D = unknown>(
    url: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    return fetchWithErrorHandling<T>(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchWithErrorHandling<T>(url, {
      method: "DELETE",
      ...options,
    });
  },
};
