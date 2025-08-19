"use client";

import { useState, useCallback } from "react";

/**
 * Hook for managing data loading, error handling, and retries
 * This approach avoids passing functions as props in client components
 */
export function useDataFetching<T>(fetchFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction]);

  const retryFetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    retryFetch,
    setData,
    setIsLoading,
    setError,
  };
}
