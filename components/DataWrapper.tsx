"use client";

import React, { useCallback, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/ui/data-states";

/**
 * DataWrapper - A component wrapper that handles common data states
 * This is a client component meant to be used with the data-states components
 *
 * Usage example:
 * ```tsx
 * <DataWrapper
 *   isLoading={isLoading}
 *   error={error}
 *   data={userData}
 *   onRetry={refetchData}
 * >
 *   {(data) => <UserProfile userData={data} />}
 * </DataWrapper>
 * ```
 */
export function DataWrapper<T>({
  children,
  data,
  isLoading,
  error,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  errorTitle,
  className,
}: {
  children: React.ReactNode;
  data: T | null | undefined;
  isLoading: boolean;
  error: unknown | null;
  onRetry?: () => Promise<void> | void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  errorTitle?: string;
  className?: string;
}) {
  // Handle reset errors in the error boundary
  const [errorBoundaryKey, setErrorBoundaryKey] = useState(0);

  const resetErrorBoundary = useCallback(() => {
    setErrorBoundaryKey((prev) => prev + 1);
  }, []);

  // Handle loading state
  if (isLoading) {
    return <>{loadingComponent || <LoadingState className={className} />}</>;
  }

  // Handle error state
  if (error) {
    return (
      <>
        {errorComponent || (
          <ErrorState
            error={error}
            onRetry={onRetry}
            title={errorTitle}
            className={className}
          />
        )}
      </>
    );
  }

  // Handle empty state
  if (data === null || data === undefined) {
    return <>{emptyComponent || <EmptyState className={className} />}</>;
  }

  // Handle success state with error boundary
  return (
    <ErrorBoundary
      key={errorBoundaryKey}
      fallback={(error) => (
        <ErrorState
          error={error}
          onRetry={resetErrorBoundary}
          title={
            errorTitle || "Something went wrong while displaying the content"
          }
          className={className}
        />
      )}
    >
      <div className={className}>{children}</div>
    </ErrorBoundary>
  );
}
