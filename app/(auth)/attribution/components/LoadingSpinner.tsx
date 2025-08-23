import { memo } from "react";

export const LoadingSpinner = memo(() => (
  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
));

LoadingSpinner.displayName = "LoadingSpinner";
