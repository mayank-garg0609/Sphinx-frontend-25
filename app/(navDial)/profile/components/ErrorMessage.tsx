import React, { memo } from "react";

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
  canRetry?: boolean;
}

export const ErrorMessage = memo(function ErrorMessage({ 
  error, 
  onRetry,
  canRetry = true
}: ErrorMessageProps) {
  return (
    <div className="text-red-400 bg-red-900/30 p-4 rounded-lg border border-red-500/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-center">{error}</span>
        </div>
        {canRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
});