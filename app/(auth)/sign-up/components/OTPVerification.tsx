"use client";

import { memo, useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { MESSAGES, SECURITY, OTP_CONFIG, BUTTON_STYLES } from '../utils/constants';
import { 
  handleOTPValidationError, 
  formatCooldownTime,
  isOTPRateLimited,
  getOTPCooldownTime 
} from '../utils/otpErrorHandlers';

interface OTPVerificationProps {
  readonly email: string;
  readonly onVerificationSuccess: (otp: string) => Promise<void>;
  readonly onBack: () => void;
  readonly onResend: () => Promise<void>;
  readonly disabled?: boolean;
}

export const OTPVerification = memo(function OTPVerification({
  email,
  onVerificationSuccess,
  onBack,
  onResend,
  disabled = false
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_CONFIG.LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [lastResendTime, setLastResendTime] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        const remaining = getOTPCooldownTime(lastResendTime, SECURITY.OTP.RESEND_COOLDOWN * 1000);
        setCooldownTime(remaining);
        
        if (remaining <= 0) {
          setCooldownTime(0);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldownTime, lastResendTime]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = useCallback((value: string, index: number) => {
    // Only allow digits
    const sanitizedValue = value.replace(/\D/g, '');
    
    if (sanitizedValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = sanitizedValue;
      setOtp(newOtp);

      // Auto-focus next input
      if (sanitizedValue && index < OTP_CONFIG.LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }, [otp]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (otp[index]) {
        // Clear current input
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_CONFIG.LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleVerifyOTP();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === OTP_CONFIG.LENGTH) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus last input
      inputRefs.current[OTP_CONFIG.LENGTH - 1]?.focus();
      
      // Auto-submit if enabled
      if (OTP_CONFIG.AUTO_SUBMIT_ON_COMPLETE) {
        setTimeout(() => handleVerifyOTP(newOtp), 100);
      }
    } else if (pastedData.length > 0) {
      toast.error("Please paste a valid 6-digit OTP.");
    }
  }, []);

  const handleVerifyOTP = useCallback(async (otpToVerify?: string[]) => {
    const currentOtp = otpToVerify || otp;
    const otpString = currentOtp.join('');
    
    // Validate OTP format
    const validationError = handleOTPValidationError(currentOtp);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (attemptCount >= SECURITY.OTP.MAX_ATTEMPTS) {
      toast.error("Too many failed attempts. Please request a new OTP.");
      return;
    }

    setIsVerifying(true);
    setAttemptCount(prev => prev + 1);

    try {
      await onVerificationSuccess(otpString);
      // Success is handled in the parent component
    } catch (error) {
      console.error('OTP verification failed:', error);
      // Error handling is done in the parent component
      
      // Clear OTP inputs on failed verification
      setOtp(new Array(OTP_CONFIG.LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  }, [otp, onVerificationSuccess, attemptCount]);

  const handleResendOTP = useCallback(async () => {
    if (isOTPRateLimited(lastResendTime, SECURITY.OTP.RESEND_COOLDOWN * 1000)) {
      const remaining = getOTPCooldownTime(lastResendTime, SECURITY.OTP.RESEND_COOLDOWN * 1000);
      toast.error(`Please wait ${formatCooldownTime(remaining)} before requesting another OTP.`);
      return;
    }

    setIsResending(true);
    
    try {
      await onResend();
      setLastResendTime(Date.now());
      setCooldownTime(SECURITY.OTP.RESEND_COOLDOWN * 1000);
      setAttemptCount(0); // Reset attempt count on successful resend
      
      // Clear current OTP inputs
      setOtp(new Array(OTP_CONFIG.LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP failed:', error);
      // Error handling is done in the parent component
    } finally {
      setIsResending(false);
    }
  }, [lastResendTime, onResend]);

  const isFormDisabled = disabled || isVerifying || isResending;
  const canResend = cooldownTime <= 0 && !isResending;
  const otpComplete = otp.every(digit => digit !== '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white">
          {MESSAGES.OTP.VERIFY_EMAIL}
        </h2>
        <p className="text-zinc-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
          {MESSAGES.OTP.OTP_SENT}
        </p>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl">
          <span className="font-medium">{email}</span>
        </p>
      </div>

      {/* OTP Input Fields */}
      <div className="space-y-4">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isFormDisabled}
              className={`
                w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 2xl:w-20 2xl:h-20
                text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold
                bg-white/10 border-2 border-white/30 rounded-lg
                text-white placeholder-zinc-400
                focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                ${digit ? 'border-white/60' : 'border-white/30'}
              `}
              placeholder="0"
              aria-label={`OTP digit ${index + 1}`}
              data-testid={`otp-input-${index}`}
            />
          ))}
        </div>

        {/* Attempt counter */}
        {attemptCount > 0 && attemptCount < SECURITY.OTP.MAX_ATTEMPTS && (
          <div className="text-center">
            <span className="text-yellow-400 text-xs sm:text-sm">
              Attempts: {attemptCount}/{SECURITY.OTP.MAX_ATTEMPTS}
            </span>
          </div>
        )}

        {/* Max attempts warning */}
        {attemptCount >= SECURITY.OTP.MAX_ATTEMPTS && (
          <div className="text-center">
            <span className="text-red-400 text-xs sm:text-sm">
              Maximum attempts reached. Please request a new OTP.
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Verify Button */}
        <button
          type="button"
          onClick={() => handleVerifyOTP()}
          disabled={!otpComplete || isFormDisabled || attemptCount >= SECURITY.OTP.MAX_ATTEMPTS}
          className={BUTTON_STYLES.primary}
          aria-label="Verify OTP and create account"
          data-testid="verify-otp-button"
        >
          {isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <svg 
                className="animate-spin w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {MESSAGES.LOADING.VERIFYING}
            </span>
          ) : (
            MESSAGES.OTP.VERIFY_BUTTON
          )}
        </button>

        {/* Resend Button */}
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={!canResend || isFormDisabled}
          className={BUTTON_STYLES.secondary}
          aria-label="Resend OTP to email"
          data-testid="resend-otp-button"
        >
          {isResending ? (
            <span className="flex items-center justify-center gap-2">
              <svg 
                className="animate-spin w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {MESSAGES.LOADING.SENDING}
            </span>
          ) : cooldownTime > 0 ? (
            `Resend in ${formatCooldownTime(cooldownTime)}`
          ) : (
            MESSAGES.OTP.RESEND_BUTTON
          )}
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          disabled={isFormDisabled}
          className="w-full text-zinc-400 hover:text-white font-medium py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go back to sign up form"
          data-testid="back-to-signup-button"
        >
          {MESSAGES.OTP.BACK_TO_SIGNUP}
        </button>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        {isVerifying && "Verifying OTP, please wait..."}
        {isResending && "Sending new OTP, please wait..."}
        {cooldownTime > 0 && `Resend available in ${formatCooldownTime(cooldownTime)}`}
      </div>
    </div>
  );
});