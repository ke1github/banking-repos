import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AppError } from "@/lib/utils/error-utils";
import { Button } from "@/components/ui/button";

/**
 * LoadingState - A component to show during data loading
 */
export function LoadingState({
  className,
  height = "h-24",
}: {
  className?: string;
  height?: string;
}) {
  return (
    <div className={`w-full space-y-4 ${className}`}>
      <Skeleton className="h-8 w-full" />
      <Skeleton className={`${height} w-full`} />
      <Skeleton className="h-12 w-2/3" />
    </div>
  );
}

/**
 * ErrorState - A component to display error messages
 */
export function ErrorState({
  title = "Something went wrong",
  error,
  onRetry,
  className,
}: {
  title?: string;
  error: unknown;
  onRetry?: () => void | Promise<unknown>;
  className?: string;
}) {
  // Format error message
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof AppError) {
      return err.userMessage;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return String(err || "An unexpected error occurred");
  };

  return (
    <div
      className={`p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 ${className}`}
    >
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="mb-4">{getErrorMessage(error)}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="destructive" size="sm">
          Try again
        </Button>
      )}
    </div>
  );
}

/**
 * EmptyState - A component to show when data is empty
 */
export function EmptyState({
  message = "No data available",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`text-muted-foreground text-center py-8 ${className}`}>
      {message}
    </div>
  );
}

/**
 * NoPermissionState - A component to show when user doesn't have permission
 */
export function NoPermissionState({
  message = "You don't have permission to view this content",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 ${className}`}
    >
      <h3 className="text-lg font-medium mb-2">Access Denied</h3>
      <p>{message}</p>
    </div>
  );
}

/**
 * NetworkErrorState - A component to show for network errors
 */
export function NetworkErrorState({
  message = "Unable to connect to the server. Please check your internet connection.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void | Promise<unknown>;
  className?: string;
}) {
  return (
    <div
      className={`p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 ${className}`}
    >
      <h3 className="text-lg font-medium mb-2">Connection Error</h3>
      <p className="mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm">
          Try again
        </Button>
      )}
    </div>
  );
}
