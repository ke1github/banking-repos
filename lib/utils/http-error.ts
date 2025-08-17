/**
 * HTTP error handling utilities
 */
import { AppError, ErrorCode, logError } from "./error-utils";

// HTTP status code ranges
export const HTTP_STATUS = {
  // Success codes
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client error codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server error codes
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Custom HTTP error class for better error handling
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
 */
export function createHttpError(status: number, message?: string): HttpError {
  let errorCode: ErrorCode;
  let userMessage: string;

  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      errorCode = ErrorCode.BAD_REQUEST;
      userMessage =
        "The request could not be processed. Please check your input and try again.";
      break;
    case HTTP_STATUS.UNAUTHORIZED:
      errorCode = ErrorCode.UNAUTHORIZED;
      userMessage = "You need to be logged in to perform this action.";
      break;
    case HTTP_STATUS.FORBIDDEN:
      errorCode = ErrorCode.FORBIDDEN;
      userMessage = "You don't have permission to access this resource.";
      break;
    case HTTP_STATUS.NOT_FOUND:
      errorCode = ErrorCode.NOT_FOUND;
      userMessage = "The requested resource could not be found.";
      break;
    case HTTP_STATUS.METHOD_NOT_ALLOWED:
      errorCode = ErrorCode.BAD_REQUEST;
      userMessage = "This action is not allowed.";
      break;
    case HTTP_STATUS.CONFLICT:
      errorCode = ErrorCode.CONFLICT;
      userMessage =
        "This operation cannot be completed due to a conflict with the current state of the resource.";
      break;
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      errorCode = ErrorCode.VALIDATION_ERROR;
      userMessage =
        "The provided data is invalid. Please check your input and try again.";
      break;
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      errorCode = ErrorCode.TOO_MANY_REQUESTS;
      userMessage =
        "You've made too many requests in a short time. Please try again later.";
      break;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      errorCode = ErrorCode.SERVER_ERROR;
      userMessage =
        "An unexpected server error occurred. Please try again later.";
      break;
    case HTTP_STATUS.NOT_IMPLEMENTED:
      errorCode = ErrorCode.SERVER_ERROR;
      userMessage = "This feature is not implemented yet.";
      break;
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
    case HTTP_STATUS.GATEWAY_TIMEOUT:
      errorCode = ErrorCode.SERVICE_UNAVAILABLE;
      userMessage =
        "The service is temporarily unavailable. Please try again later.";
      break;
    default:
      errorCode =
        status >= 500 ? ErrorCode.SERVER_ERROR : ErrorCode.UNKNOWN_ERROR;
      userMessage = "An unexpected error occurred. Please try again later.";
  }

  return new HttpError(
    status,
    errorCode,
    message || `HTTP Error ${status}`,
    userMessage
  );
}

/**
 * Fetch with automatic error handling
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    // Check if the response is successful
    if (!response.ok) {
      // Try to parse error message from response body
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP Error ${response.status}`;
      } catch {
        // If parsing fails, use status text
        errorMessage = response.statusText || `HTTP Error ${response.status}`;
      }

      throw createHttpError(response.status, errorMessage);
    }

    // For successful responses, check if it has JSON content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    // For empty responses or non-JSON responses
    if (response.status === HTTP_STATUS.NO_CONTENT) {
      return {} as T;
    }

    // Handle text responses
    const text = await response.text();
    try {
      // Try to parse as JSON in case content-type header was wrong
      return JSON.parse(text) as T;
    } catch {
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
      logError(error, { url, options });
      throw new HttpError(
        0, // Status code 0 for network errors
        ErrorCode.NETWORK_ERROR,
        `Network error while fetching ${url}: ${error.message}`,
        "A network error occurred. Please check your internet connection and try again."
      );
    }

    // Log and rethrow other errors
    logError(error, { url, options });
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

  async post<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    return fetchWithErrorHandling<T>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  async put<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    return fetchWithErrorHandling<T>(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  async patch<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    return fetchWithErrorHandling<T>(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
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

/**
 * Timeout promise utility
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new HttpError(
            0,
            ErrorCode.TIMEOUT_ERROR,
            errorMessage || `Request timed out after ${timeoutMs}ms`,
            "The request timed out. Please try again later."
          )
        );
      }, timeoutMs);
    }),
  ]) as Promise<T>;
}
