"use client";

import React, { useEffect } from "react";
import { useDataFetching } from "@/lib/hooks/useDataFetching";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/ui/data-states";
import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * A generic component for fetching and displaying data with proper loading/error states
 *
 * @example
 * ```tsx
 * <AsyncDataRenderer
 *   fetchFn={fetchUserData}
 *   dependencies={[userId]}
 *   renderEmpty={() => <EmptyState message="No user data available" />}
 * >
 *   {(userData) => <UserProfile data={userData} />}
 * </AsyncDataRenderer>
 * ```
 */
export function AsyncDataRenderer<T>({
  fetchFn,
  children,
  dependencies = [],
  loadingHeight = "h-48",
  errorTitle = "Could not load data",
  renderEmpty,
  className,
}: {
  fetchFn: () => Promise<T>;
  children: (data: T) => React.ReactNode;
  dependencies?: React.DependencyList;
  loadingHeight?: string;
  errorTitle?: string;
  renderEmpty?: (retry: () => void) => React.ReactNode;
  className?: string;
}) {
  const {
    data,
    isLoading,
    error,
    fetchData: refetch,
  } = useDataFetching<T>(fetchFn);

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  // Loading state
  if (isLoading) {
    return <LoadingState height={loadingHeight} className={className} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        title={errorTitle}
        className={className}
      />
    );
  }

  // Empty state
  if (!data) {
    return renderEmpty ? (
      renderEmpty(refetch)
    ) : (
      <EmptyState className={className} />
    );
  }

  // Success state with error boundary
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <ErrorState
          error={error}
          onRetry={reset}
          title="Error displaying content"
          className={className}
        />
      )}
    >
      <div className={className}>{children(data)}</div>
    </ErrorBoundary>
  );
}
