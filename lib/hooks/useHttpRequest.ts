"use client";

import { useState, useCallback } from "react";
import { httpClient, HttpError } from "@/lib/utils/http-error";
import { ErrorCode } from "@/lib/utils/error-utils";
import { logError } from "@/lib/utils/logger";

interface UseHttpRequestOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: HttpError) => void;
  initialData?: T;
}

interface UseHttpRequestResult<T, D> {
  data: T | undefined;
  loading: boolean;
  error: HttpError | null;
  execute: (data?: D) => Promise<T | undefined>;
  reset: () => void;
}

/**
 * Custom hook for making HTTP requests with built-in state management and error handling
 *
 * @example
 * // GET request
 * const { data, loading, error, execute } = useHttpRequest<UserProfile>({
 *   method: 'GET',
 *   url: '/api/profile',
 * });
 *
 * // POST request
 * const { data, loading, error, execute } = useHttpRequest<ApiResponse, FormData>({
 *   method: 'POST',
 *   url: '/api/users',
 * });
 *
 * // Usage with execute
 * const handleSubmit = async (formData) => {
 *   const response = await execute(formData);
 *   if (response) {
 *     // Handle success
 *   }
 * };
 */
export function useHttpRequest<T, D = Record<string, unknown>>({
  method,
  url,
  options,
  onSuccess,
  onError,
  initialData,
}: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  options?: Omit<RequestInit, "method" | "body">;
} & UseHttpRequestOptions<T>): UseHttpRequestResult<T, D> {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HttpError | null>(null);

  const execute = useCallback(
    async (requestData?: D): Promise<T | undefined> => {
      try {
        setLoading(true);
        setError(null);

        let response: T;

        switch (method) {
          case "GET":
            response = await httpClient.get<T>(url, options);
            break;
          case "POST":
            response = await httpClient.post<T, D>(url, requestData, options);
            break;
          case "PUT":
            response = await httpClient.put<T, D>(url, requestData, options);
            break;
          case "PATCH":
            response = await httpClient.patch<T, D>(url, requestData, options);
            break;
          case "DELETE":
            response = await httpClient.delete<T>(url, options);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        setData(response);
        onSuccess?.(response);
        return response;
      } catch (err) {
        if (err instanceof HttpError) {
          setError(err);
          onError?.(err);
        } else {
          // Fallback for unexpected errors
          const httpError = new HttpError(
            500,
            ErrorCode.SERVER_ERROR,
            err instanceof Error ? err.message : "Unknown error",
            "An unexpected error occurred. Please try again later."
          );
          setError(httpError);
          onError?.(httpError);
          logError(err, "HTTP Request", { method, url });
        }
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [method, url, options, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

export default useHttpRequest;
