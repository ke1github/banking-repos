"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { AppError, ErrorCode } from "@/lib/utils/error-utils";

interface ErrorContextType {
  error: AppError | null;
  setError: (error: AppError | null) => void;
  clearError: () => void;
  showError: (message: string, code?: ErrorCode) => void;
  showValidationError: (message: string) => void;
  showNetworkError: (message?: string) => void;
  showAuthError: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearError = useCallback(() => setError(null), []);

  const showError = useCallback(
    (message: string, code: ErrorCode = ErrorCode.UNKNOWN_ERROR) => {
      setError(new AppError(code, message, message));
    },
    []
  );

  const showValidationError = useCallback((message: string) => {
    setError(new AppError(ErrorCode.VALIDATION_ERROR, message, message));
  }, []);

  const showNetworkError = useCallback((message?: string) => {
    setError(
      new AppError(
        ErrorCode.NETWORK_ERROR,
        message || "Network error occurred",
        message ||
          "A network error occurred. Please check your connection and try again."
      )
    );
  }, []);

  const showAuthError = useCallback((message: string) => {
    setError(new AppError(ErrorCode.AUTHENTICATION_FAILED, message, message));
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        error,
        setError,
        clearError,
        showError,
        showValidationError,
        showNetworkError,
        showAuthError,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}
