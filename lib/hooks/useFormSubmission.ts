"use client";

import { useState, useCallback } from "react";
import { parseActionError, AppError } from "@/lib/utils/error-utils";

interface UseFormSubmissionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
}

/**
 * Custom hook to handle form submissions with error handling
 *
 * @param submitFn - The async function that submits the form (e.g., a server action)
 * @param options - Options for handling success and error cases
 * @returns Object with submission state and handleSubmit function
 */
export function useFormSubmission<T = unknown, D = unknown>(
  submitFn: (data: D) => Promise<T | { error?: string }>,
  options?: UseFormSubmissionOptions<T>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const handleSubmit = useCallback(
    async (formData: D) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await submitFn(formData);

        // Check if the result has an error property (server action error format)
        if (result && typeof result === "object" && "error" in result) {
          const actionError = parseActionError(result as { error?: string });
          if (actionError) {
            setError(actionError);
            options?.onError?.(actionError);
            return false;
          }
        }

        setData(result as T);
        options?.onSuccess?.(result as T);
        return true;
      } catch (err: unknown) {
        const appError = parseActionError({ error: (err as Error).message });
        setError(appError);
        options?.onError?.(appError!);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [submitFn, options]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    handleSubmit,
    clearError,
  };
}

export default useFormSubmission;
