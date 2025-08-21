// app/(auth)/sign-up/components/OTPVerification.tsx
'use client';

import { memo, useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { sendOTP, verifyOTP } from '../services/otpApi';
import { tokenManager, handleOTPVerificationSuccess } from '../utils/authHelpers';
import { 
  handleOTPSendError, 
  handleOTPVerifyError, 
  handleOTPValidationError,
  showOTPSuccessMessage 
} from '../utils/otpErrorHandlers';
import { ACCESSIBILITY, BUTTON_STYLES } from '../utils/constants';

interface OTPVerificationProps {
  readonly email: string;
  readonly onVerificationSuccess: () => void;
  readonly onBack: () => void;
  readonly disabled?: boolean;
  readonly router?: any; // Add router prop
}

export const OTPVerification = memo(function OTPVerification({
  email,
  onVerificationSuccess,
  onBack,
  disabled = false,
  router,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // Auto-send OTP when component mounts
  useEffect(() => {
    handleSendOTP();
  }, []);

  const handleSendOTP = useCallback(async () => {
    const token = tokenManager.getAccessToken();
    if (!token) {
      const errorMessage = 'Authentication required. Please sign up first.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsSendingOTP(true);
    setError(null);

    try {
      const response = await sendOTP(token);
      showOTPSuccessMessage('send', email);
      setCountdown(60); // 60 second countdown
    } catch (error) {
      const errorMessage = handleOTPSendError(error);
      setError(errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  }, [email]);

  const handleOtpChange = useCallback((index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1 || (value && !/^\d$/.test(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        if (digits.length === 6) {
          const newOtp = digits.split('');
          setOtp(newOtp);
          inputRefs.current[5]?.focus();
        }
      }).catch(() => {
        // Ignore paste errors
      });
    }
  }, [otp]);

  const handleVerifyOTP = useCallback(async () => {
    // Client-side validation
    const validationError = handleOTPValidationError(otp);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const token = tokenManager.getAccessToken();
    if (!token) {
      const errorMessage = 'Authentication required. Please sign up first.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const otpString = otp.join('');
      const response = await verifyOTP(token, otpString);
      
      showOTPSuccessMessage('verify');
      
      // Handle OTP verification success
      if (router) {
        await handleOTPVerificationSuccess(router);
      }
      
      onVerificationSuccess();
    } catch (error) {
      const errorMessage = handleOTPVerifyError(error);
      setError(errorMessage);
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  }, [otp, onVerificationSuccess, router]);

  const isOtpComplete = otp.every(digit => digit !== '');
  const canResend = countdown === 0 && !isSendingOTP;

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
          Verify Your Email
        </h3>
        <p className="text-sm sm:text-base text-zinc-300">
          Enter the 6-digit code sent to
        </p>
        <p className="text-sm sm:text-base text-blue-400 font-medium">
          {email}
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
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={disabled || isLoading}
              className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-lg bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors ${
                error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={`OTP digit ${index + 1}`}
              data-testid={`otp-input-${index}`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="text-red-400 text-sm text-center flex items-center justify-center gap-1"
            role="alert"
            aria-live={ACCESSIBILITY.LIVE_REGIONS.ASSERTIVE}
          >
            <svg 
              className="w-4 h-4 flex-shrink-0" 
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

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleVerifyOTP}
          disabled={disabled || !isOtpComplete || isLoading}
          className={BUTTON_STYLES.primary}
          aria-label="Verify OTP"
          data-testid="verify-otp-button"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center">
          <button
            type="button"
            onClick={handleSendOTP}
            disabled={disabled || !canResend}
            className="text-blue-400 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            data-testid="resend-otp-button"
          >
            {isSendingOTP ? 'Sending...' : canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={disabled || isLoading}
            className="text-zinc-400 hover:text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            data-testid="back-button"
          >
            ← Back to Sign Up
          </button>
        </div>
      </div>

      {/* Loading indicator for screen readers */}
      {(isLoading || isSendingOTP) && (
        <div className="sr-only" aria-live={ACCESSIBILITY.LIVE_REGIONS.POLITE}>
          {isLoading ? 'Verifying OTP, please wait...' : 'Sending OTP, please wait...'}
        </div>
      )}
    </div>
  );
});