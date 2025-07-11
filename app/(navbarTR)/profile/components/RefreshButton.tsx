import React, { memo } from "react";
import { getRequestTracker, canMakeRequest } from "../utils/requestTracker";
import { MAX_REQUESTS_PER_SESSION } from "../utils/constants";

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  canRefresh?: boolean;
}

export const RefreshButton = memo(function RefreshButton({
  onRefresh,
  isRefreshing,
  canRefresh = true,
}: RefreshButtonProps) {
  const tracker = getRequestTracker();
  const remainingRequests = MAX_REQUESTS_PER_SESSION - tracker.count;
  
  return (
    <div className="mb-4">
      <button
        onClick={onRefresh}
        disabled={isRefreshing || !canRefresh || !canMakeRequest()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
      >
        <svg
          className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
      </button>
      <div className="text-xs text-gray-400 mt-1">
        Requests remaining: {remainingRequests}
      </div>
    </div>
  );
});