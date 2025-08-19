import { AppwriteException } from "appwrite";

/**
 * Format error response based on error type
 */
export function formatErrorResponse(error: unknown): {
  message: string;
  statusCode: number;
  errorCode?: string;
  details?: Record<string, unknown>;
} {
  // Default error response
  const defaultResponse = {
    message: "An unexpected error occurred",
    statusCode: 500,
  };

  // Handle Appwrite errors
  if (error instanceof AppwriteException) {
    return {
      message: error.message,
      statusCode: error.code >= 100 && error.code < 600 ? error.code : 500,
      errorCode: error.type,
      details: {
        appwriteType: error.type,
      },
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
      details: {
        name: error.name,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
    };
  }

  // For unknown error types
  return defaultResponse;
}
