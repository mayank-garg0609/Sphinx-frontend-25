import { memo, useMemo } from "react";
import Link from "next/link";

interface TermsCheckboxProps {
  register: any;
  error?: string;
  disabled?: boolean;
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
        className="text-blue-400 hover:underline font-medium"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms and Conditions
      </Link>
    ),
    []
  );

  return (
    <div className="space-y-1">
      <div className="flex items-start text-xs lg:text-sm gap-2 text-zinc-300">
        <input
          type="checkbox"
          id="agreed"
          disabled={disabled}
          {...register("agreed")}
          className="mt-1 accent-white scale-110 lg:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label htmlFor="agreed" className="leading-tight">
          I agree to the {termsLink}
        </label>
      </div>
      {error && (
        <span className="text-red-400 text-xs lg:text-sm block">{error}</span>
      )}
    </div>
  );
});