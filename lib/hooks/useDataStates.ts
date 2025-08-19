"use client";

import { useState } from "react";

/**
 * Custom hook for managing data states in components
 * @returns State management functions for data loading, errors, and success
 */
export function useDataStates<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Retry the fetch operation by resetting the error and loading states
   */
  const retryFetch = () => {
    setError(null);
    setIsLoading(true);
  };

  return {
    data,
    isLoading,
    error,
    setData,
    setIsLoading,
    setError,
    retryFetch,
  };
}
