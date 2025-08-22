'use client';

import { memo, useCallback } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { MESSAGES, ACCESSIBILITY } from '../utils/constants';

interface ActionButtonsProps {
  readonly isSubmitting: boolean;
  readonly onGoogleLogin: () => void;
  readonly isGoogleLoading: boolean;
  readonly googlePopupClosed: boolean;
  readonly isRateLimited: boolean;
  readonly isGoogleRateLimited: boolean;
  readonly googleError: string | null;
}

export const ActionButtons = memo(function ActionButtons({
  isSubmitting,
  onGoogleLogin,
  isGoogleLoading,
  googlePopupClosed,
  isRateLimited,
  isGoogleRateLimited,
  googleError,
}: ActionButtonsProps) {
  const getGoogleButtonText = useCallback(() => {
    if (isGoogleRateLimited) {
      return 'Please wait...';
    }
    if (googlePopupClosed && !isGoogleLoading) {
      return MESSAGES.AUTH.CONTINUE_WITH_GOOGLE;
    }
    if (isGoogleLoading) {
      return MESSAGES.AUTH.AUTHENTICATING;
    }
    return MESSAGES.AUTH.CONTINUE_WITH_GOOGLE;
  }, [googlePopupClosed, isGoogleLoading, isGoogleRateLimited]);

  const getLoginButtonText = useCallback(() => {
    if (isRateLimited) {
      return 'Please wait...';
    }
    if (isSubmitting) {
      return MESSAGES.AUTH.LOGGING_IN;
    }
    return MESSAGES.AUTH.LOG_IN_BUTTON;
  }, [isSubmitting, isRateLimited]);

  const isLoginDisabled = isSubmitting || isGoogleLoading || isRateLimited;
  const isGoogleDisabled = isGoogleLoading || isSubmitting || isGoogleRateLimited;

  return (
    <div className="space-y-4">
      {/* Primary Login Button */}
      <button
        type="submit"
        disabled={isLoginDisabled}
        className={`
          w-full h-12 px-4 
          bg-blue-600 hover:bg-blue-700 
          disabled:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed
          text-white font-semibold rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black
          transition-all duration-200
          flex items-center justify-center
        `}
        aria-label={
          isSubmitting 
            ? ACCESSIBILITY.ARIA_LABELS.LOADING_SPINNER 
            : ACCESSIBILITY.ARIA_LABELS.LOGIN_BUTTON
        }
        aria-describedby={isRateLimited ? 'rate-limit-message' : undefined}
        data-testid="login-button"
      >
        {isSubmitting && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {getLoginButtonText()}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-black px-4 text-zinc-400">or continue with</span>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={isGoogleDisabled}
        className={`
          w-full h-12 px-4
          bg-zinc-800 hover:bg-zinc-700 border border-zinc-600
          disabled:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed
          text-white font-medium rounded-lg
          focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-black
          transition-all duration-200
          flex items-center justify-center gap-3
        `}
        aria-label={ACCESSIBILITY.ARIA_LABELS.GOOGLE_LOGIN_BUTTON}
        aria-describedby={
          googleError 
            ? 'google-error-message' 
            : isGoogleRateLimited 
              ? 'rate-limit-message' 
              : undefined
        }
        data-testid="google-login-button"
      >
        {isGoogleLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <FcGoogle className="w-5 h-5" aria-hidden="true" />
        )}
        <span>{getGoogleButtonText()}</span>
      </button>

      {/* Error Messages */}
      {googleError && (
        <div
          id="google-error-message"
          className="text-red-400 text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
          role="alert"
          aria-live={ACCESSIBILITY.LIVE_REGIONS.ASSERTIVE}
        >
          {googleError}
        </div>
      )}

      {/* Rate Limit Message */}
      {(isRateLimited || isGoogleRateLimited) && (
        <div
          id="rate-limit-message"
          className="text-yellow-400 text-sm text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
          role="alert"
          aria-live={ACCESSIBILITY.LIVE_REGIONS.POLITE}
        >
          Too many attempts. Please wait before trying again.
        </div>
      )}

      {/* Loading indicator for screen readers */}
      {(isSubmitting || isGoogleLoading) && (
        <div className="sr-only" aria-live={ACCESSIBILITY.LIVE_REGIONS.POLITE}>
          {isSubmitting ? 'Logging in, please wait...' : 'Authenticating with Google, please wait...'}
        </div>
      )}
    </div>
  );
});