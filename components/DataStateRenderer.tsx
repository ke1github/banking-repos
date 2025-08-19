"use client";

import React from "react";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/ui/data-states";

/**
 * A component that renders different UI based on data loading state
 * Use with the useDataStates hook
 *
 * @example
 * ```tsx
 * function AccountsPage() {
 *   const { data, isLoading, error, setIsLoading, setData, setError } = useDataStates();
 *
 *   useEffect(() => {
 *     setIsLoading(true);
 *     fetch('/api/accounts')
 *       .then(res => res.json())
 *       .then(data => setData(data))
 *       .catch(err => setError(err))
 *       .finally(() => setIsLoading(false));
 *   }, []);
 *
 *   return (
 *     <DataStateRenderer
 *       data={data}
 *       isLoading={isLoading}
 *       error={error}
 *       onRetry={() => fetchData()}
 *     >
 *       {(accountsData) => <AccountsList accounts={accountsData} />}
 *     </DataStateRenderer>
 *   );
 * }
 * ```
 */
export function DataStateRenderer<T>({
  data,
  isLoading,
  error,
  children,
  onRetryAction,
  loadingFallback,
  errorFallback,
  emptyFallback,
  loadingHeight = "h-48",
  errorTitle = "Could not load data",
  emptyMessage = "No data available",
  className,
}: {
  data: T | null;
  isLoading: boolean;
  error: unknown | null;
  children: React.ReactNode | ((data: T) => React.ReactNode);
  onRetryAction?: () => Promise<void>;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  loadingHeight?: string;
  errorTitle?: string;
  emptyMessage?: string;
  className?: string;
}) {
  // Handle loading state
  if (isLoading) {
    if (loadingFallback) return <>{loadingFallback}</>;
    return <LoadingState height={loadingHeight} className={className} />;
  }

  // Handle error state
  if (error) {
    if (errorFallback) return <>{errorFallback}</>;
    return (
      <ErrorState
        error={error}
        onRetry={onRetryAction}
        title={errorTitle}
        className={className}
      />
    );
  }

  // Handle empty state
  if (!data) {
    if (emptyFallback) return <>{emptyFallback}</>;
    return <EmptyState message={emptyMessage} className={className} />;
  }

  // Render children with data
  if (typeof children === "function") {
    return <>{children(data)}</>;
  }

  // Or just render children directly
  return <>{children}</>;
}
