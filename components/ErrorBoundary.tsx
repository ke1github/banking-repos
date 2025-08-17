"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logError } from "@/lib/utils/error-utils";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React component errors
 *
 * Usage:
 * <ErrorBoundary fallback={<YourFallbackComponent />}>
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 *
 * or with a function as fallback:
 * <ErrorBoundary fallback={(error, reset) => <YourFallbackComponent error={error} onReset={reset} />}>
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error reporting service
    logError(error, { componentStack: errorInfo.componentStack });
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error!, this.reset);
      }

      return (
        this.props.fallback || (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <h2 className="text-lg font-medium mb-2">Something went wrong</h2>
            <p className="mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={this.reset}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
