import React, { memo } from "react";

interface LoginPromptProps {
  onLogin: () => void;
}

export const LoginPrompt = memo(function LoginPrompt({ onLogin }: LoginPromptProps) {
  return (
    <div className="text-center text-white">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-gray-300 text-lg">
            Please log in to view your profile
          </p>
        </div>
        
        <button
          onClick={onLogin}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Login to Continue</span>
        </button>
      </div>
    </div>
  );
});