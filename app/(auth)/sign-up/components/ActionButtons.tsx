'use client';

import { memo, useCallback } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BUTTON_STYLES, MESSAGES, ACCESSIBILITY } from '../utils/constants';

interface ActionButtonsProps {
  readonly isSubmitting: boolean;
  readonly onGoogleSignup: () => void;
  readonly isGoogleLoading: boolean;
  readonly googlePopupClosed: boolean;
  readonly isRateLimited: boolean;
  readonly isGoogleRateLimited: boolean;
  readonly googleError: string | null;
}

export const ActionButtons = memo(function ActionButtons({
  isSubmitting,
  onGoogleSignup,
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

  const getSignupButtonText = useCallback(() => {
    if (isRateLimited) {
      return 'Please wait...';
    }
    if (isSubmitting) {
      return MESSAGES.AUTH.CREATING_ACCOUNT;
    }
    return MESSAGES.AUTH.SIGNUP_BUTTON;
  }, [isSubmitting, isRateLimited]);

  const isSignupDisabled = isSubmitting || isGoogleLoading || isRateLimited;
  const isGoogleDisabled = isGoogleLoading || isSubmitting || isGoogleRateLimited;

  return (
    <div className="space-y-4">
      {/* Primary Signup Button */}
      <button
        type="submit"
        disabled={isSignupDisabled}
        className={`
          group relative w-full h-11 px-4 
          bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600
          hover:from-blue-700 hover:via-blue-600 hover:to-blue-700
          disabled:from-gray-600 disabled:via-gray-500 disabled:to-gray-600
          border border-blue-400/30 rounded-lg
          text-white font-semibold text-sm
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-4 focus:ring-blue-400/30
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg shadow-blue-500/25
          hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]
          active:scale-[0.98]
          overflow-hidden
        `}
        aria-label={
          isSubmitting 
            ? ACCESSIBILITY.ARIA_LABELS.LOADING_SPINNER 
            : ACCESSIBILITY.ARIA_LABELS.SIGNUP_BUTTON
        }
        aria-describedby={isRateLimited ? 'rate-limit-message' : undefined}
        data-testid="signup-button"
      >
        {/* Button background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        <div className="relative flex items-center justify-center gap-3">
          {isSubmitting && (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          )}
          <span>{getSignupButtonText()}</span>
          {!isSubmitting && (
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          )}
        </div>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative bg-black px-3">
          <span className="text-xs text-white/60 font-medium">or continue with</span>
        </div>
      </div>

      {/* Google Signup Button */}
      <button
        type="button"
        onClick={onGoogleSignup}
        disabled={isGoogleDisabled}
        className={`
          group relative w-full h-11 px-4
          bg-white/5 hover:bg-white/10 
          backdrop-blur-sm
          border-2 border-white/20 hover:border-white/30
          rounded-lg
          text-white font-medium text-sm
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-4 focus:ring-white/20
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:shadow-lg hover:shadow-white/5 hover:scale-[1.02]
          active:scale-[0.98]
        `}
        aria-label={ACCESSIBILITY.ARIA_LABELS.GOOGLE_SIGNUP_BUTTON}
        aria-describedby={
          googleError 
            ? 'google-error-message' 
            : isGoogleRateLimited 
              ? 'rate-limit-message' 
              : undefined
        }
        data-testid="google-signup-button"
      >
        <div className="flex items-center justify-center gap-2">
          <FcGoogle 
            className="w-4 h-4" 
            aria-hidden="true" 
          />
          {isGoogleLoading && (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          )}
          <span>{getGoogleButtonText()}</span>
        </div>
      </button>

      {/* Error Messages */}
      {googleError && (
        <div
          id="google-error-message"
          className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-400/20 rounded-lg p-3 animate-in slide-in-from-top-1 duration-300"
          role="alert"
          aria-live={ACCESSIBILITY.LIVE_REGIONS.ASSERTIVE}
        >
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{googleError}</span>
        </div>
      )}

      {/* Rate Limit Message */}
      {(isRateLimited || isGoogleRateLimited) && (
        <div
          id="rate-limit-message"
          className="flex items-start gap-2 text-yellow-400 text-sm bg-yellow-500/10 border border-yellow-400/20 rounded-lg p-3 animate-in slide-in-from-top-1 duration-300"
          role="alert"
          aria-live={ACCESSIBILITY.LIVE_REGIONS.POLITE}
        >
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Too many attempts. Please wait before trying again.</span>
        </div>
      )}

      {/* Loading indicator for screen readers */}
      {(isSubmitting || isGoogleLoading) && (
        <div className="sr-only" aria-live={ACCESSIBILITY.LIVE_REGIONS.POLITE}>
          {isSubmitting ? 'Creating account, please wait...' : 'Authenticating with Google, please wait...'}
        </div>
      )}
    </div>
  );
})