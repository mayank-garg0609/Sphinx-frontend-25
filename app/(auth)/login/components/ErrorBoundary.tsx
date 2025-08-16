// components/ErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { handleComponentError } from '@/app/(auth)/login/utils/errorHandlers';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  errorId: string;
}

// Default Error Fallback Component
const DefaultErrorFallback: React.ComponentType<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  errorId,
}) => {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[200px] flex items-center justify-center p-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg"
    >
      <div className="text-center max-w-md">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-red-800 mb-2">
          Oops! Something went wrong
        </h2>

        <p className="text-red-700 mb-4 text-sm">
          We're sorry for the inconvenience. The application encountered an unexpected error.
        </p>

        {isDev && (
          <details className="text-left mb-4 p-3 bg-red-100 border border-red-200 rounded text-xs">
            <summary className="cursor-pointer font-mono text-red-800 font-semibold">
              🐛 Error Details (Development Only)
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <strong className="text-red-800">Error ID:</strong>
                <code className="block font-mono bg-white p-1 rounded border text-red-700 mt-1">
                  {errorId}
                </code>
              </div>
              <div>
                <strong className="text-red-800">Message:</strong>
                <code className="block font-mono bg-white p-1 rounded border text-red-700 mt-1">
                  {error.message}
                </code>
              </div>
              {error.stack && (
                <div>
                  <strong className="text-red-800">Stack Trace:</strong>
                  <pre className="block font-mono bg-white p-2 rounded border text-red-700 mt-1 text-xs overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="space-y-2">
          <button
            onClick={resetErrorBoundary}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
            aria-label="Try to recover from error"
          >
            Try Again
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            aria-label="Reload the page"
          >
            Reload Page
          </button>
        </div>

        {!isDev && (
          <p className="text-xs text-red-600 mt-4">
            Error ID: <code className="font-mono">{errorId}</code>
            <br />
            Please share this ID with support if the issue persists.
          </p>
        )}
      </div>
    </div>
  );
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', {
      error,
      errorInfo,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      // Use default error handler
      handleComponentError(error, errorInfo);
    }

    // Report to error tracking service (Sentry, LogRocket, etc.)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      // Example: LogRocket.captureException(error);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys !== resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => prevProps.resetKeys?.[index] !== key
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }

    // Reset error boundary when any prop changes (if enabled)
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    // Clear any existing timeout
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    // Add small delay to prevent rapid resets
    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: '',
      });
    }, 100);
  };

  render() {
    const { hasError, error, errorId } = this.state;
    const { children, fallback: Fallback = DefaultErrorFallback } = this.props;

    if (hasError && error) {
      return (
        <Fallback
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
          errorId={errorId}
        />
      );
    }

    return children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for manual error reporting
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: ErrorInfo) => {
    // Manual error reporting
    console.error('Manual error report:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    });

    handleComponentError(error, errorInfo || { componentStack: '' });
  }, []);
}