"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { toast, Toaster } from "sonner";
import { AppError, ErrorCode } from "@/lib/utils/error-utils";
import {
  FiAlertTriangle,
  FiAlertCircle,
  FiWifi,
  FiLock,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

interface ToastContextType {
  showError: (message: string, error?: AppError) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  dismiss: (id?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  // Function to get appropriate icon based on error code
  const getErrorIcon = (errorCode?: ErrorCode) => {
    // Network errors
    if (
      errorCode === ErrorCode.NETWORK_ERROR ||
      errorCode === ErrorCode.TIMEOUT_ERROR ||
      errorCode === ErrorCode.CONNECTION_ERROR
    ) {
      return <FiWifi className="text-blue-500" />;
    }

    // Authentication errors
    if (
      errorCode === ErrorCode.AUTHENTICATION_FAILED ||
      errorCode === ErrorCode.INVALID_CREDENTIALS ||
      errorCode === ErrorCode.SESSION_EXPIRED ||
      errorCode === ErrorCode.UNAUTHORIZED ||
      errorCode === ErrorCode.FORBIDDEN
    ) {
      return <FiLock className="text-purple-500" />;
    }

    // Validation errors
    if (
      errorCode === ErrorCode.VALIDATION_ERROR ||
      errorCode === ErrorCode.REQUIRED_FIELD_MISSING ||
      errorCode === ErrorCode.INVALID_EMAIL_FORMAT ||
      errorCode === ErrorCode.INVALID_PASSWORD_FORMAT
    ) {
      return <FiAlertCircle className="text-yellow-500" />;
    }

    // Default error icon
    return <FiAlertTriangle className="text-red-500" />;
  };

  // Function to get error title based on error code
  const getErrorTitle = (errorCode?: ErrorCode): string => {
    if (!errorCode) return "Error";

    // Authentication errors
    if (
      errorCode === ErrorCode.AUTHENTICATION_FAILED ||
      errorCode === ErrorCode.INVALID_CREDENTIALS ||
      errorCode === ErrorCode.SESSION_EXPIRED ||
      errorCode === ErrorCode.USER_NOT_FOUND
    ) {
      return "Authentication Error";
    }

    // Authorization errors
    if (
      errorCode === ErrorCode.UNAUTHORIZED ||
      errorCode === ErrorCode.FORBIDDEN
    ) {
      return "Authorization Error";
    }

    // Validation errors
    if (
      errorCode === ErrorCode.VALIDATION_ERROR ||
      errorCode === ErrorCode.REQUIRED_FIELD_MISSING ||
      errorCode === ErrorCode.INVALID_EMAIL_FORMAT ||
      errorCode === ErrorCode.INVALID_PASSWORD_FORMAT ||
      errorCode === ErrorCode.PASSWORDS_DO_NOT_MATCH
    ) {
      return "Validation Error";
    }

    // Banking operation errors
    if (
      errorCode === ErrorCode.INSUFFICIENT_FUNDS ||
      errorCode === ErrorCode.INVALID_ACCOUNT ||
      errorCode === ErrorCode.TRANSACTION_FAILED ||
      errorCode === ErrorCode.TRANSFER_LIMIT_EXCEEDED ||
      errorCode === ErrorCode.ACCOUNT_LOCKED
    ) {
      return "Transaction Error";
    }

    // Network errors
    if (
      errorCode === ErrorCode.NETWORK_ERROR ||
      errorCode === ErrorCode.TIMEOUT_ERROR ||
      errorCode === ErrorCode.CONNECTION_ERROR
    ) {
      return "Network Error";
    }

    // Server errors
    if (
      errorCode === ErrorCode.SERVER_ERROR ||
      errorCode === ErrorCode.SERVICE_UNAVAILABLE
    ) {
      return "Server Error";
    }

    // HTTP errors
    if (
      errorCode === ErrorCode.BAD_REQUEST ||
      errorCode === ErrorCode.NOT_FOUND ||
      errorCode === ErrorCode.CONFLICT ||
      errorCode === ErrorCode.TOO_MANY_REQUESTS
    ) {
      return "Request Error";
    }

    return "Error";
  };

  const showError = (message: string, error?: AppError) => {
    const title = error ? getErrorTitle(error.code) : "Error";
    const icon = error ? (
      getErrorIcon(error.code)
    ) : (
      <FiAlertTriangle className="text-red-500" />
    );

    toast.error(message, {
      id: `error-${Date.now()}`,
      duration: 8000, // Errors stay longer
      icon: icon,
      description:
        error?.userMessage !== message ? error?.userMessage : undefined,
      action:
        error?.code === ErrorCode.NETWORK_ERROR
          ? {
              label: "Retry",
              onClick: () => window.location.reload(),
            }
          : undefined,
    });
  };

  const showSuccess = (message: string, title = "Success") => {
    toast.success(message, {
      id: `success-${Date.now()}`,
      duration: 4000,
      icon: <FiCheckCircle className="text-green-500" />,
    });
  };

  const showWarning = (message: string, title = "Warning") => {
    toast(message, {
      id: `warning-${Date.now()}`,
      duration: 6000,
      icon: <FiAlertCircle className="text-yellow-500" />,
    });
  };

  const showInfo = (message: string, title = "Information") => {
    toast.info(message, {
      id: `info-${Date.now()}`,
      duration: 5000,
      icon: <FiInfo className="text-blue-500" />,
    });
  };

  const dismiss = (id?: string) => {
    toast.dismiss(id);
  };

  return (
    <ToastContext.Provider
      value={{
        showError,
        showSuccess,
        showWarning,
        showInfo,
        dismiss,
      }}
    >
      {children}
      <Toaster
        position="bottom-right"
        closeButton
        richColors
        toastOptions={{
          className: "sonner-toast",
          style: {
            borderRadius: "8px",
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
