"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import type { UseFormRegister } from "react-hook-form";
import type { SignUpFormData } from "@/app/schemas/signupSchema";

interface TermsCheckboxProps {
  readonly register: UseFormRegister<SignUpFormData>;
  readonly error?: string;
  readonly disabled?: boolean;
}

export const TermsCheckbox = memo(function TermsCheckbox({
  register,
  error,
  disabled = false,
}: TermsCheckboxProps) {
  const [isHovered, setIsHovered] = useState(false);

  const termsLink = useMemo(
    () => (
      <Link
        href="/terms-and-conditions"
        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-400/60 hover:decoration-blue-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:rounded"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms and Conditions
      </Link>
    ),
    []
  );

  return (
    <div className="space-y-2">
      <div
        className={`
          flex items-start gap-3 p-4 rounded-xl
          bg-white/5 backdrop-blur-sm border-2 border-white/10
          hover:border-white/20 hover:bg-white/8
          transition-all duration-300 ease-out
          ${error ? "border-red-400/50 bg-red-500/5" : ""}
          ${isHovered ? "shadow-lg shadow-white/5" : ""}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id="agreed"
            disabled={disabled}
            {...register("agreed")}
            className="
              sr-only peer
            "
            aria-describedby={error ? "agreed-error" : undefined}
          />
          <label
            htmlFor="agreed"
            className="
              relative flex items-center justify-center
              w-5 h-5 border-2 border-white/40 rounded
              bg-transparent cursor-pointer
              peer-checked:bg-blue-500 peer-checked:border-blue-500
              peer-focus:ring-4 peer-focus:ring-blue-400/30
              peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
              hover:border-white/60 hover:bg-white/5
              transition-all duration-200
            "
          >
            <svg
              className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </label>
        </div>

        <div className="flex-1">
          <label
            htmlFor="agreed"
            className="text-white/90 text-xs leading-relaxed cursor-pointer select-none"
          >
            I agree to the {termsLink}
            <span className="text-red-400 ml-1" aria-label="required">
              *
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div
          id="agreed-error"
          className="flex items-start gap-2 text-red-400 text-sm animate-in slide-in-from-top-1 duration-300 px-1"
          role="alert"
        >
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});
