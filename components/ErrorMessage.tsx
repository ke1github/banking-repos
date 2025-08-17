"use client";

import React from "react";
import { AppError, ErrorCode } from "@/lib/utils/error-utils";
import {
  FiAlertTriangle,
  FiX,
  FiAlertCircle,
  FiWifi,
  FiLock,
} from "react-icons/fi";

interface ErrorMessageProps {
  error: AppError;
  onDismiss?: () => void;
}

export default function ErrorMessage({ error, onDismiss }: ErrorMessageProps) {
  // Select the appropriate styling and icon based on error type
  const getErrorStyles = () => {
    switch (error.code) {
      case ErrorCode.VALIDATION_ERROR:
      case ErrorCode.REQUIRED_FIELD_MISSING:
      case ErrorCode.INVALID_EMAIL_FORMAT:
      case ErrorCode.INVALID_PASSWORD_FORMAT:
      case ErrorCode.INVALID_PHONE_FORMAT:
      case ErrorCode.INVALID_DATE_FORMAT:
      case ErrorCode.INVALID_AMOUNT:
      case ErrorCode.PASSWORDS_DO_NOT_MATCH:
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          iconColor: "text-yellow-500",
          icon: <FiAlertCircle className="h-5 w-5" />,
        };
      case ErrorCode.NETWORK_ERROR:
      case ErrorCode.TIMEOUT_ERROR:
      case ErrorCode.CONNECTION_ERROR:
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          iconColor: "text-blue-500",
          icon: <FiWifi className="h-5 w-5" />,
        };
      case ErrorCode.AUTHENTICATION_FAILED:
      case ErrorCode.INVALID_CREDENTIALS:
      case ErrorCode.SESSION_EXPIRED:
      case ErrorCode.UNAUTHORIZED:
      case ErrorCode.FORBIDDEN:
        return {
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          textColor: "text-purple-800",
          iconColor: "text-purple-500",
          icon: <FiLock className="h-5 w-5" />,
        };
      default:
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-500",
          icon: <FiAlertTriangle className="h-5 w-5" />,
        };
    }
  };

  const styles = getErrorStyles();

  return (
    <div
      className={`${styles.bgColor} ${styles.borderColor} ${styles.textColor} border rounded-lg p-4 mb-4 relative`}
      role="alert"
    >
      <div className="flex items-start">
        <div className={`${styles.iconColor} flex-shrink-0 mr-3`}>
          {styles.icon}
        </div>
        <div className="flex-1">
          <p className="font-medium">{error.userMessage}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`${styles.textColor} ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-opacity-25 hover:bg-gray-500`}
          >
            <span className="sr-only">Dismiss</span>
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
