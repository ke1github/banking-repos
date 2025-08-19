/**
 * Unified error handling system for the application
 * This file combines error handling functionality from multiple files
 */

import { AppwriteException } from "appwrite";
import { ErrorCode, AppError } from "./error-utils";

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

// Consolidated map of Appwrite error types to our error codes and user-friendly messages
export const ERROR_MAP: Record<string, { code: ErrorCode; message: string }> = {
  // Authentication errors
  user_invalid_credentials: {
    code: ErrorCode.INVALID_CREDENTIALS,
    message:
      "The email or password you entered is incorrect. Please try again.",
  },
  user_session_expired: {
    code: ErrorCode.SESSION_EXPIRED,
    message: "Your session has expired. Please log in again to continue.",
  },
  user_invalid_token: {
    code: ErrorCode.AUTHENTICATION_FAILED,
    message: "Your authentication has expired. Please log in again.",
  },
  user_unauthorized: {
    code: ErrorCode.UNAUTHORIZED,
    message: "You don't have permission to perform this action.",
  },
  user_missing_scope: {
    code: ErrorCode.AUTHENTICATION_FAILED,
    message: "Authentication required. Please log in to continue.",
  },
  user_not_found: {
    code: ErrorCode.USER_NOT_FOUND,
    message: "We couldn't find an account with that email address.",
  },
  user_already_exists: {
    code: ErrorCode.EMAIL_ALREADY_EXISTS,
    message:
      "An account with this email already exists. Please use a different email or log in.",
  },
  user_blocked: {
    code: ErrorCode.ACCOUNT_LOCKED,
    message:
      "Your account has been temporarily locked. Please contact support or try again later.",
  },
  user_jwt_invalid: {
    code: ErrorCode.AUTHENTICATION_FAILED,
    message: "Your login session is invalid. Please log in again.",
  },
  user_password_reset_required: {
    code: ErrorCode.AUTHENTICATION_FAILED,
    message: "You need to reset your password before continuing.",
  },
  password_weak: {
    code: ErrorCode.WEAK_PASSWORD,
    message:
      "Please use a stronger password with at least 8 characters, including uppercase letters, lowercase letters, and numbers.",
  },
  password_mismatch: {
    code: ErrorCode.VALIDATION_ERROR,
    message: "The passwords you entered do not match.",
  },
  password_dictionary: {
    code: ErrorCode.WEAK_PASSWORD,
    message:
      "The password you've chosen is too common. Please choose a more unique password.",
  },

  // Rate limiting and general errors
  general_rate_limit_exceeded: {
    code: ErrorCode.TOO_MANY_REQUESTS,
    message:
      "You've made too many requests. Please wait a moment and try again.",
  },
  general_argument_invalid: {
    code: ErrorCode.VALIDATION_ERROR,
    message:
      "One or more fields contain invalid information. Please check your inputs and try again.",
  },

  // Database errors
  document_not_found: {
    code: ErrorCode.NOT_FOUND,
    message: "The requested information could not be found.",
  },
  document_already_exists: {
    code: ErrorCode.CONFLICT,
    message: "This record already exists and cannot be created again.",
  },

  // Network errors
  general_request_failed: {
    code: ErrorCode.NETWORK_ERROR,
    message:
      "Network connection error. Please check your internet connection and try again.",
  },
  general_unknown: {
    code: ErrorCode.UNKNOWN_ERROR,
    message: "An unexpected error occurred. Please try again.",
  },
};

// HTTP status code to error mapping
export const HTTP_ERROR_MAP: Record<
  number,
  { code: ErrorCode; message: string }
> = {
  400: {
    code: ErrorCode.BAD_REQUEST,
    message:
      "The request could not be processed. Please check your input and try again.",
  },
  401: {
    code: ErrorCode.UNAUTHORIZED,
    message: "You need to be logged in to perform this action.",
  },
  403: {
    code: ErrorCode.FORBIDDEN,
    message: "You don't have permission to access this resource.",
  },
  404: {
    code: ErrorCode.NOT_FOUND,
    message: "The requested resource could not be found.",
  },
  405: {
    code: ErrorCode.BAD_REQUEST,
    message: "This action is not allowed.",
  },
  409: {
    code: ErrorCode.CONFLICT,
    message:
      "This operation cannot be completed due to a conflict with the current state of the resource.",
  },
  422: {
    code: ErrorCode.VALIDATION_ERROR,
    message:
      "The provided data is invalid. Please check your input and try again.",
  },
  429: {
    code: ErrorCode.TOO_MANY_REQUESTS,
    message:
      "You've made too many requests in a short time. Please try again later.",
  },
  500: {
    code: ErrorCode.SERVER_ERROR,
    message: "An unexpected server error occurred. Please try again later.",
  },
  501: {
    code: ErrorCode.SERVER_ERROR,
    message: "This feature is not yet implemented.",
  },
  502: {
    code: ErrorCode.SERVER_ERROR,
    message: "The server received an invalid response. Please try again later.",
  },
  503: {
    code: ErrorCode.SERVICE_UNAVAILABLE,
    message: "The service is temporarily unavailable. Please try again later.",
  },
  504: {
    code: ErrorCode.TIMEOUT_ERROR,
    message: "The server took too long to respond. Please try again later.",
  },
};

/**
 * Create an HttpError based on status code
 */
export function createHttpError(status: number, message?: string): HttpError {
  const errorInfo = HTTP_ERROR_MAP[status] || {
    code: ErrorCode.UNKNOWN_ERROR,
    message: "An unexpected error occurred. Please try again later.",
  };

  return new HttpError(
    status,
    errorInfo.code,
    message || `HTTP Error ${status}`,
    errorInfo.message
  );
}

/**
 * Handle Appwrite specific errors and convert them to our AppError format
 */
export function handleAppwriteError(error: unknown): AppError {
  if (error instanceof AppwriteException) {
    // Check if we have a direct mapping for this error type
    if (error.type && ERROR_MAP[error.type]) {
      const errorInfo = ERROR_MAP[error.type];
      return new AppError(
        errorInfo.code,
        error.message || `Appwrite error: ${error.type}`,
        errorInfo.message
      );
    }

    // Check if we have an HTTP code mapping
    if (error.code && HTTP_ERROR_MAP[error.code]) {
      const errorInfo = HTTP_ERROR_MAP[error.code];
      return new HttpError(
        error.code,
        errorInfo.code,
        error.message || `HTTP error ${error.code}`,
        errorInfo.message
      );
    }
  }

  // For unknown errors, return a generic error
  const message = error instanceof Error ? error.message : String(error);
  return new AppError(
    ErrorCode.UNKNOWN_ERROR,
    message,
    "An unexpected error occurred. Please try again later."
  );
}

/**
 * Validate form data and return error information
 */
export type ValidationError = {
  field: string;
  message: string;
};

/**
 * Create a validation error
 */
export function createValidationError(
  validationErrors: ValidationError[]
): AppError {
  const message = validationErrors
    .map((err) => `${err.field}: ${err.message}`)
    .join(", ");

  return new AppError(
    ErrorCode.VALIDATION_ERROR,
    `Validation failed: ${message}`,
    "Please fix the errors in the form and try again."
  );
}

/**
 * Parse a server action error response
 */
export function parseActionError(
  errorResponse: { error: string } | { errors: ValidationError[] }
): AppError {
  if ("errors" in errorResponse) {
    return createValidationError(errorResponse.errors);
  }

  return new AppError(
    ErrorCode.UNKNOWN_ERROR,
    errorResponse.error,
    errorResponse.error
  );
}
