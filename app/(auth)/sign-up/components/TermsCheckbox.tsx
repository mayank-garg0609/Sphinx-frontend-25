'use client';

import { memo, useMemo } from "react";
import Link from "next/link";
import type { UseFormRegister } from 'react-hook-form';
import type { SignUpFormData } from '@/app/schemas/signupSchema';

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
  const termsLink = useMemo(
    () => (
      <Link
        href="/terms-and-conditions"
        className="text-blue-400 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms and Conditions
      </Link>
    ),
    []
  );

  return (
    <div className="flex flex-col text-zinc-300 gap-1.5 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-2.5 2xl:gap-3">
      <div className="flex items-start text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl gap-2">
        <input
          type="checkbox"
          id="agreed"
          disabled={disabled}
          {...register("agreed")}
          className="mt-1 accent-white scale-110 sm:scale-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          aria-describedby={error ? "agreed-error" : undefined}
        />
        <label htmlFor="agreed" className="leading-tight">
          I agree to the {termsLink}
          <span className="text-red-400 ml-1">*</span>
        </label>
      </div>
      {error && (
        <span 
          id="agreed-error"
          className="text-red-400 text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base 2xl:text-lg"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
});