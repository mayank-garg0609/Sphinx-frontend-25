import { memo } from "react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = memo(function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div 
      className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center gap-3">
        <svg 
          className="w-8 h-8 text-red-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        
        <div>
          <h2 className="text-lg font-semibold text-red-800 mb-1">
            Something went wrong
          </h2>
          <p className="text-sm text-red-600 mb-3">
            The sign-up form encountered an error. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-red-500 mb-3">
              <summary className="cursor-pointer font-mono">Error details (dev only)</summary>
              <pre className="mt-2 text-left bg-red-100 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          aria-label="Try again"
        >
          Try Again
        </button>
      </div>
    </div>
  );
});
