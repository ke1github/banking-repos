/**
 * Core error types and enums for the application
 *
 * Note: The actual error handling implementation has been moved to error-handler.ts
 * This file only contains the type definitions that are imported by error-handler.ts
 */

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
 * Validation error type
 */
export interface ValidationError {
  field: string;
  message: string;
}

// Note: All implementation functions have been moved to error-handler.ts
// This file now only contains the type definitions
