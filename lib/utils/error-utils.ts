/**
 * Centralized error handling utilities for the application
 */

import { AppwriteException } from "appwrite";

/**
 * Error codes for different types of application errors
 */
export enum ErrorCode {
  // Authentication errors
  AUTHENTICATION_FAILED = "auth_failed",
  INVALID_CREDENTIALS = "invalid_credentials",
  SESSION_EXPIRED = "session_expired",
  USER_NOT_FOUND = "user_not_found",
  EMAIL_ALREADY_EXISTS = "email_already_exists",
  WEAK_PASSWORD = "weak_password",

  // Banking operation errors
  INSUFFICIENT_FUNDS = "insufficient_funds",
  INVALID_ACCOUNT = "invalid_account",
  TRANSACTION_FAILED = "transaction_failed",
  TRANSFER_LIMIT_EXCEEDED = "transfer_limit_exceeded",
  ACCOUNT_LOCKED = "account_locked",
  INVALID_TRANSACTION = "invalid_transaction",

  // Form validation errors
  VALIDATION_ERROR = "validation_error",
  REQUIRED_FIELD_MISSING = "required_field_missing",
  INVALID_EMAIL_FORMAT = "invalid_email_format",
  INVALID_PASSWORD_FORMAT = "invalid_password_format",
  INVALID_PHONE_FORMAT = "invalid_phone_format",
  INVALID_DATE_FORMAT = "invalid_date_format",
  INVALID_AMOUNT = "invalid_amount",
  PASSWORDS_DO_NOT_MATCH = "passwords_do_not_match",

  // HTTP errors
  BAD_REQUEST = "bad_request", // 400
  UNAUTHORIZED = "unauthorized", // 401
  FORBIDDEN = "forbidden", // 403
  NOT_FOUND = "not_found", // 404
  CONFLICT = "conflict", // 409
  TOO_MANY_REQUESTS = "too_many_requests", // 429
  SERVER_ERROR = "server_error", // 500
  SERVICE_UNAVAILABLE = "service_unavailable", // 503

  // Network errors
  NETWORK_ERROR = "network_error",
  TIMEOUT_ERROR = "timeout_error",
  CONNECTION_ERROR = "connection_error",

  // Unknown error
  UNKNOWN_ERROR = "unknown_error",
}

/**
 * Standard application error with code and user-friendly message
 */
export class AppError extends Error {
  code: ErrorCode;
  userMessage: string;

  constructor(code: ErrorCode, message: string, userMessage?: string) {
    super(message);
    this.code = code;
    this.userMessage = userMessage || message;
    this.name = "AppError";
  }
}

/**
 * Handle Appwrite specific errors and convert them to our AppError format
 */
export function handleAppwriteError(error: unknown): AppError {
  console.error("Appwrite error:", error);

  if (error instanceof AppwriteException) {
    // Map Appwrite error types to our error codes
    switch (error.type) {
      case "user_invalid_credentials":
        return new AppError(
          ErrorCode.INVALID_CREDENTIALS,
          "Invalid email or password",
          "The email or password you entered is incorrect. Please try again."
        );

      case "user_session_expired":
        return new AppError(
          ErrorCode.SESSION_EXPIRED,
          "User session expired",
          "Your session has expired. Please login again."
        );

      case "user_not_found":
        return new AppError(
          ErrorCode.USER_NOT_FOUND,
          "User not found",
          "We could not find an account with that email address."
        );

      case "user_already_exists":
        return new AppError(
          ErrorCode.EMAIL_ALREADY_EXISTS,
          "Email already exists",
          "An account with this email address already exists. Please use a different email or try logging in."
        );

      case "user_invalid_token":
        return new AppError(
          ErrorCode.AUTHENTICATION_FAILED,
          "Invalid authentication token",
          "Your authentication has expired. Please log in again."
        );

      case "user_blocked":
        return new AppError(
          ErrorCode.ACCOUNT_LOCKED,
          "Account locked",
          "Your account has been temporarily locked due to multiple failed login attempts. Please try again later or contact support."
        );

      case "password_weak":
        return new AppError(
          ErrorCode.WEAK_PASSWORD,
          "Password too weak",
          "Your password is too weak. Please use a stronger password with at least 8 characters, including uppercase letters, lowercase letters, and numbers."
        );

      case "general_rate_limit_exceeded":
        return new AppError(
          ErrorCode.TOO_MANY_REQUESTS,
          "Too many requests",
          "You've made too many requests in a short time. Please try again later."
        );

      // Database-related errors
      case "document_not_found":
        return new AppError(
          ErrorCode.NOT_FOUND,
          "Resource not found",
          "The requested resource could not be found."
        );

      case "document_already_exists":
        return new AppError(
          ErrorCode.CONFLICT,
          "Resource already exists",
          "This resource already exists and cannot be created again."
        );

      default:
        // For other Appwrite errors, map HTTP code to our error codes
        if (error.code) {
          switch (error.code) {
            case 400:
              return new AppError(
                ErrorCode.BAD_REQUEST,
                `Bad request: ${error.message}`,
                "The request could not be processed. Please check your input and try again."
              );
            case 401:
              return new AppError(
                ErrorCode.UNAUTHORIZED,
                `Unauthorized: ${error.message}`,
                "You need to be logged in to perform this action."
              );
            case 403:
              return new AppError(
                ErrorCode.FORBIDDEN,
                `Forbidden: ${error.message}`,
                "You don't have permission to access this resource."
              );
            case 404:
              return new AppError(
                ErrorCode.NOT_FOUND,
                `Not found: ${error.message}`,
                "The requested resource could not be found."
              );
            case 409:
              return new AppError(
                ErrorCode.CONFLICT,
                `Conflict: ${error.message}`,
                "This operation cannot be completed due to a conflict with the current state of the resource."
              );
            case 429:
              return new AppError(
                ErrorCode.TOO_MANY_REQUESTS,
                `Too many requests: ${error.message}`,
                "You've made too many requests in a short time. Please try again later."
              );
            case 503:
              return new AppError(
                ErrorCode.SERVICE_UNAVAILABLE,
                `Service unavailable: ${error.message}`,
                "The service is temporarily unavailable. Please try again later."
              );
            default:
              return new AppError(
                ErrorCode.SERVER_ERROR,
                `Appwrite error (${error.code}): ${error.message}`,
                "An unexpected error occurred. Please try again later."
              );
          }
        }

        return new AppError(
          ErrorCode.SERVER_ERROR,
          `Appwrite error: ${error.message}`,
          "An unexpected error occurred. Please try again later."
        );
    }
  }

  // Handle network errors
  if (error instanceof Error) {
    if (error.name === "NetworkError" || error.message.includes("network")) {
      return new AppError(
        ErrorCode.NETWORK_ERROR,
        `Network error: ${error.message}`,
        "A network error occurred. Please check your internet connection and try again."
      );
    }

    if (error.message.includes("timeout") || error.name === "TimeoutError") {
      return new AppError(
        ErrorCode.TIMEOUT_ERROR,
        `Timeout error: ${error.message}`,
        "The request timed out. Please try again later."
      );
    }

    return new AppError(
      ErrorCode.UNKNOWN_ERROR,
      error.message,
      "An unexpected error occurred. Please try again later."
    );
  }

  return new AppError(
    ErrorCode.UNKNOWN_ERROR,
    "Unknown error occurred",
    "An unexpected error occurred. Please try again later."
  );
}

/**
 * Parse error response from server actions
 */
export function parseActionError(result: { error?: string }): AppError | null {
  if (!result || !result.error) return null;

  // Map common error messages to specific error codes
  const errorMessage = result.error.toLowerCase();

  // Authentication errors
  if (
    errorMessage.includes("invalid email or password") ||
    errorMessage.includes("invalid credentials")
  ) {
    return new AppError(
      ErrorCode.INVALID_CREDENTIALS,
      result.error,
      "The email or password you entered is incorrect. Please try again."
    );
  }

  if (errorMessage.includes("email already exists")) {
    return new AppError(
      ErrorCode.EMAIL_ALREADY_EXISTS,
      result.error,
      "An account with this email address already exists. Please use a different email or try logging in."
    );
  }

  if (errorMessage.includes("session expired")) {
    return new AppError(
      ErrorCode.SESSION_EXPIRED,
      result.error,
      "Your session has expired. Please login again."
    );
  }

  // Banking operation errors
  if (errorMessage.includes("insufficient funds")) {
    return new AppError(
      ErrorCode.INSUFFICIENT_FUNDS,
      result.error,
      "You don't have enough funds to complete this transaction."
    );
  }

  if (
    errorMessage.includes("invalid account") ||
    errorMessage.includes("account not found")
  ) {
    return new AppError(
      ErrorCode.INVALID_ACCOUNT,
      result.error,
      "The account information provided is invalid or the account doesn't exist."
    );
  }

  if (errorMessage.includes("transfer limit")) {
    return new AppError(
      ErrorCode.TRANSFER_LIMIT_EXCEEDED,
      result.error,
      "This transfer exceeds your daily or transaction limit."
    );
  }

  // Validation errors
  if (
    errorMessage.includes("required field") ||
    errorMessage.includes("is required")
  ) {
    return new AppError(
      ErrorCode.REQUIRED_FIELD_MISSING,
      result.error,
      result.error // Use the original message for validation errors
    );
  }

  if (
    errorMessage.includes("invalid email") ||
    errorMessage.includes("email format")
  ) {
    return new AppError(
      ErrorCode.INVALID_EMAIL_FORMAT,
      result.error,
      "Please enter a valid email address."
    );
  }

  if (errorMessage.includes("invalid password")) {
    return new AppError(
      ErrorCode.INVALID_PASSWORD_FORMAT,
      result.error,
      "Password must be at least 8 characters long and include uppercase, lowercase, and numbers."
    );
  }

  if (errorMessage.includes("passwords do not match")) {
    return new AppError(
      ErrorCode.PASSWORDS_DO_NOT_MATCH,
      result.error,
      "The passwords you entered don't match. Please try again."
    );
  }

  // Default case - use the original error message
  return new AppError(ErrorCode.SERVER_ERROR, result.error, result.error);
}

/**
 * Handle HTTP errors
 */
export function handleHttpError(status: number, message?: string): AppError {
  let errorCode: ErrorCode;
  let userMessage: string;

  switch (status) {
    case 400:
      errorCode = ErrorCode.BAD_REQUEST;
      userMessage =
        "The request could not be processed. Please check your input and try again.";
      break;
    case 401:
      errorCode = ErrorCode.UNAUTHORIZED;
      userMessage = "You need to be logged in to perform this action.";
      break;
    case 403:
      errorCode = ErrorCode.FORBIDDEN;
      userMessage = "You don't have permission to access this resource.";
      break;
    case 404:
      errorCode = ErrorCode.NOT_FOUND;
      userMessage = "The requested resource could not be found.";
      break;
    case 409:
      errorCode = ErrorCode.CONFLICT;
      userMessage =
        "This operation cannot be completed due to a conflict with the current state of the resource.";
      break;
    case 429:
      errorCode = ErrorCode.TOO_MANY_REQUESTS;
      userMessage =
        "You've made too many requests in a short time. Please try again later.";
      break;
    case 503:
      errorCode = ErrorCode.SERVICE_UNAVAILABLE;
      userMessage =
        "The service is temporarily unavailable. Please try again later.";
      break;
    default:
      errorCode =
        status >= 500 ? ErrorCode.SERVER_ERROR : ErrorCode.UNKNOWN_ERROR;
      userMessage = "An unexpected error occurred. Please try again later.";
  }

  return new AppError(
    errorCode,
    message || `HTTP Error ${status}`,
    userMessage
  );
}

/**
 * Handle form validation errors
 */
export interface ValidationError {
  field: string;
  message: string;
}

export function createValidationError(errors: ValidationError[]): AppError {
  const messages = errors
    .map((err) => `${err.field}: ${err.message}`)
    .join(", ");
  return new AppError(
    ErrorCode.VALIDATION_ERROR,
    `Validation failed: ${messages}`,
    "Please fix the errors in the form and try again."
  );
}

/**
 * Check for network connectivity
 */
export async function checkConnectivity(): Promise<boolean> {
  try {
    // Try to fetch a small resource to check connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch("https://cloud.appwrite.io/v1/health/time", {
      method: "HEAD",
      cache: "no-cache",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return true;
  } catch {
    // Network error or timeout
    return false;
  }
}

/**
 * Log errors to a centralized system
 * This could be expanded to send errors to a monitoring service
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  console.error("Application error:", error, context ? { context } : "");

  // Add timestamp for better tracking
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error,
    context: context || {},
  };

  // Log to console for development
  console.error("Error details:", JSON.stringify(errorInfo, null, 2));

  // Here you could add additional logging to a service like Sentry, LogRocket, etc.
  // if (process.env.NODE_ENV === 'production') {
  //   // Sentry.captureException(error, { extra: { ...context, timestamp } });
  // }
}
