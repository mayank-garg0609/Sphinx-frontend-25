'use client';

import { memo, useCallback, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { ACCESSIBILITY } from '../utils/constants';

interface OTPInputProps {
  readonly length: number;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly onComplete?: (value: string) => void;
}

export const OTPInput = memo(function OTPInput({
  length,
  value,
  onChange,
  disabled = false,
  error,
  onComplete,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length }, (_, index) => value[index] || '');

  const focusNextInput = useCallback((index: number) => {
    const nextIndex = index + 1;
    if (nextIndex < length && inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex]?.focus();
    }
  }, [length]);

  const focusPrevInput = useCallback((index: number) => {
    const prevIndex = index - 1;
    if (prevIndex >= 0 && inputRefs.current[prevIndex]) {
      inputRefs.current[prevIndex]?.focus();
    }
  }, []);

  const handleChange = useCallback((index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return; // Only allow digits
    
    const newValue = digits.map((d, i) => i === index ? digit : d).join('');
    onChange(newValue);

    if (digit && index < length - 1) {
      focusNextInput(index);
    }

    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  }, [digits, onChange, length, focusNextInput, onComplete]);

  const handleKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        focusPrevInput(index);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusPrevInput(index);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusNextInput(index);
    }
  }, [digits, focusNextInput, focusPrevInput]);

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    const pastedDigits = pastedData.slice(0, length);
    onChange(pastedDigits);

    if (pastedDigits.length === length && onComplete) {
      onComplete(pastedDigits);
    }
  }, [length, onChange, onComplete]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold
              border-2 rounded-lg bg-transparent text-white
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 
              focus:ring-offset-black transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-white/30 focus:border-white'
              }
            `}
            aria-label={`OTP digit ${index + 1} of ${length}`}
            aria-describedby={error ? 'otp-error' : undefined}
            data-testid={`otp-input-${index}`}
          />
        ))}
      </div>
      
      {error && (
        <div
          id="otp-error"
          className="text-red-400 text-xs sm:text-sm text-center flex items-center justify-center gap-1"
          role="alert"
          aria-live={ACCESSIBILITY.LIVE_REGIONS.ASSERTIVE}
        >
          <svg 
            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
});