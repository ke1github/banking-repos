"use client";

import React from "react";
import { useDataFetching } from "@/lib/hooks/useDataFetching";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/ui/data-states";
import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * Higher-order component (HOC) that adds data fetching, loading, and error states to a component
 *
 * @example
 * ```tsx
 * // Define your component
 * function UserProfile({ data }) {
 *   return <div>{data.name}</div>;
 * }
 *
 * // Wrap it with withDataFetching
 * export default withDataFetching(UserProfile, {
 *   fetchDataFn: () => fetch('/api/user').then(r => r.json()),
 *   loadingHeight: "h-32",
 *   errorTitle: "Could not load user profile"
 * });
 * ```
 */
export function withDataFetching<TData, P extends { data: TData }>(
  Component: React.ComponentType<P>,
  options: {
    fetchDataFn: () => Promise<TData>;
    loadingHeight?: string;
    errorTitle?: string;
    emptyMessage?: string;
  }
) {
  // Return a new component that wraps the original
  return function WithDataFetching(props: Omit<P, "data">) {
    const {
      fetchDataFn,
      loadingHeight = "h-48",
      errorTitle = "Could not load data",
      emptyMessage = "No data available",
    } = options;

    // Disabling the rule for specific instances where we need to use the any type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, isLoading, error, retryFetch } =
      useDataFetching<TData>(fetchDataFn);

    // Handle loading state
    if (isLoading) {
      return <LoadingState height={loadingHeight} />;
    }

    // Handle error state
    if (error) {
      return (
        <ErrorState error={error} onRetry={retryFetch} title={errorTitle} />
      );
    }

    // Handle empty state
    if (!data) {
      return <EmptyState message={emptyMessage} />;
    }

    // Render the wrapped component with data and other props
    return (
      <ErrorBoundary
        fallback={(error, reset) => (
          <ErrorState
            error={error}
            onRetry={reset}
            title="Error displaying content"
          />
        )}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Component {...(props as any)} data={data} />
      </ErrorBoundary>
    );
  };
}
