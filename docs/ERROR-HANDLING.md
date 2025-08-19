# Error Handling System Refactoring

## Overview

The error handling system has been refactored to reduce redundancy and provide a more consistent approach across the application. This document outlines the changes made and the new structure of the error handling system.

## Files Structure

### Core Type Definitions

- **error-utils.ts**: Contains only the core types and enums used throughout the error handling system
  - `ErrorCode` enum: Standardized error codes for the application
  - `AppError` class: Base error class with error code and user-friendly message
  - `ValidationError` interface: For structured validation errors

### Implementation Files

- **error-handler.ts**: Consolidated error handling implementation
  - `HTTP_STATUS` constants
  - `HttpError` class: For HTTP-specific errors
  - `createHttpError()`: Creates HTTP errors with proper status codes
  - `handleAppwriteError()`: Processes Appwrite-specific errors
  - `createValidationError()`: Creates validation errors
  - `parseActionError()`: Parses errors from server actions

### Deprecated/Compatibility Files

- **http-error.ts**: Kept for backward compatibility

  - Re-exports and wraps functionality from error-handler.ts
  - Contains the `httpClient` for making HTTP requests with error handling
  - Marked as deprecated, to be removed in a future version

- **appwrite-errors.ts**: Kept for backward compatibility
  - Re-exports and wraps functionality from error-handler.ts
  - Contains helper functions specific to Appwrite
  - Marked as deprecated, to be removed in a future version

## Usage Examples

### Creating and Handling HTTP Errors

```typescript
import { createHttpError, HTTP_STATUS } from "@/lib/utils/error-handler";

// Create an HTTP error
const error = createHttpError(HTTP_STATUS.NOT_FOUND, "User not found");

// Handle errors with status codes
try {
  // Some code that might throw
} catch (error) {
  if (error instanceof HttpError && error.status === HTTP_STATUS.UNAUTHORIZED) {
    // Handle unauthorized error
  }
}
```

### Handling Appwrite Errors

```typescript
import { handleAppwriteError } from "@/lib/utils/error-handler";

try {
  // Appwrite operation
} catch (error) {
  const appError = handleAppwriteError(error);
  // Use appError.code, appError.message, or appError.userMessage
}
```

### Creating Validation Errors

```typescript
import { createValidationError } from "@/lib/utils/error-handler";

const validationErrors = [
  { field: "email", message: "Invalid email format" },
  { field: "password", message: "Password too short" },
];

throw createValidationError(validationErrors);
```

## Migration Guide

1. For new code, import from error-handler.ts instead of the deprecated files:

   - Use `error-handler.ts` instead of `http-error.ts`
   - Use `error-handler.ts` instead of `appwrite-errors.ts`

2. If you need HTTP client functionality, you can still import `httpClient` from `http-error.ts`

3. For validation, use `createValidationError` from `error-handler.ts`

## Benefits of the Refactoring

1. **Reduced Duplication**: Error handling logic is now centralized
2. **Consistent Error Format**: All errors follow the same structure
3. **Easier Maintenance**: Changes to error handling only need to be made in one place
4. **Better Type Safety**: Clear type definitions for all error-related entities
5. **Gradual Migration**: Backward compatibility allows for gradual updates to the new system
