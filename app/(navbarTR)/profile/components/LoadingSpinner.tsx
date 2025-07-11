import React, { memo } from "react";

export const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      <p className="text-lg font-semibold animate-pulse">Loading profile...</p>
    </div>
  );
});