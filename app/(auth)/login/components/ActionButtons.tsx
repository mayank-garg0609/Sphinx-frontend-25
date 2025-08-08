'use client';

import { memo, useCallback } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BUTTON_STYLES } from '../utils/constants';

interface ActionButtonsProps {
  readonly isSubmitting: boolean;
  readonly onGoogleLogin: () => void;
  readonly isGoogleLoading: boolean;
  readonly googlePopupClosed: boolean;
}

export const ActionButtons = memo(function ActionButtons({
  isSubmitting,
  onGoogleLogin,
  isGoogleLoading,
  googlePopupClosed,
}: ActionButtonsProps) {
  const getGoogleButtonText = useCallback(() => {
    if (googlePopupClosed) return 'Continue with Google';
    if (isGoogleLoading) return 'Authenticating...';
    return 'Continue with Google';
  }, [googlePopupClosed, isGoogleLoading]);

  return (
    <div className="space-y-3 lg:space-y-3">
      <button
        type="submit"
        disabled={isSubmitting || isGoogleLoading}
        className={BUTTON_STYLES.primary}
        aria-label={isSubmitting ? 'Logging in...' : 'Log in to your account'}
      >
        {isSubmitting ? 'Logging In...' : 'Log In'}
      </button>

      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={isGoogleLoading || isSubmitting}
        className={BUTTON_STYLES.secondary}
        aria-label="Continue with Google"
      >
        <FcGoogle className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
        <span>{getGoogleButtonText()}</span>
      </button>
    </div>
  );
});