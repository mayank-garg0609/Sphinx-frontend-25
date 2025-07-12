import React, { memo } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";

export const UpdateButton = memo(function RefreshButton({}) {
  const router = useTransitionRouter();

  return (
    <div className="mb-">
      <button
        onClick={(e) => {
          e.preventDefault;
          router.push("/update", { onTransitionReady: slideInOut });
        }}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
      >
        <svg
          className={`w-4 h-4 }`}
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
        <div>
          <h1> UPDATE YOUR PROFILE</h1>
        </div>
      </button>
    </div>
  );
});
