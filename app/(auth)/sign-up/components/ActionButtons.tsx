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
    <div className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-3 xl:space-y-4 2xl:space-y-5">
      {/* Primary Signup Button */}
      <button
        type="submit"
        disabled={isSignupDisabled}
        className={BUTTON_STYLES.primary}
        aria-label={
          isSubmitting 
            ? ACCESSIBILITY.ARIA_LABELS.LOADING_SPINNER 
            : ACCESSIBILITY.ARIA_LABELS.SIGNUP_BUTTON
        }
        aria-describedby={isRateLimited ? 'rate-limit-message' : undefined}
        data-testid="signup-button"
      >
        {getSignupButtonText()}
      </button>

      {/* Google Signup Button */}
      <button
        type="button"
        onClick={onGoogleSignup}
        disabled={isGoogleDisabled}
        className={BUTTON_STYLES.secondary}
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
        <FcGoogle 
          className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" 
          aria-hidden="true" 
        />
        <span>{getGoogleButtonText()}</span>
      </button>

      {/* Error Messages */}
      {googleError && (
        <div
          id="google-error-message"
          className="text-red-400 text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base 2xl:text-lg text-center"
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
          className="text-yellow-400 text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base 2xl:text-lg text-center"
          role="alert"
          aria-live={ACCESSIBILITY.LIVE_REGIONS.POLITE}
        >
          Too many attempts. Please wait before trying again.
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
});
