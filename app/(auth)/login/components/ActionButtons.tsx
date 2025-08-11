'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BUTTON_STYLES } from '../utils/constants';

interface ActionButtonsProps {
  readonly isSubmitting: boolean;
  readonly onGoogleLogin: () => void;
  readonly isGoogleLoading: boolean;
  readonly googlePopupClosed: boolean;
  readonly isLocked?: boolean;
  readonly isGoogleLocked?: boolean;
}

export const ActionButtons = memo(function ActionButtons({
  isSubmitting,
  onGoogleLogin,
  isGoogleLoading,
  googlePopupClosed,
  isLocked = false,
  isGoogleLocked = false,
}: ActionButtonsProps) {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Reset click count after 5 seconds
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const getGoogleButtonText = useCallback(() => {
    if (isGoogleLocked) return 'Temporarily Locked';
    if (googlePopupClosed) return 'Continue with Google';
    if (isGoogleLoading) return 'Authenticating...';
    return 'Continue with Google';
  }, [googlePopupClosed, isGoogleLoading, isGoogleLocked]);

  const getLoginButtonText = useCallback(() => {
    if (isLocked) return 'Temporarily Locked';
    if (isSubmitting) return 'Logging In...';
    return 'Log In';
  }, [isSubmitting, isLocked]);

  // Enhanced click handler with rate limiting
  const handleGoogleClick = useCallback(() => {
    const now = Date.now();
    
    // Prevent rapid clicking (rate limiting)
    if (now - lastClickTime < 1000) {
      setClickCount(prev => prev + 1);
      
      // Block if too many rapid clicks
      if (clickCount > 5) {
        console.warn('Too many rapid clicks detected');
        return;
      }
    } else {
      setClickCount(0);
    }
    
    setLastClickTime(now);
    
    if (!isGoogleLoading && !isSubmitting && !isGoogleLocked) {
      onGoogleLogin();
    }
  }, [onGoogleLogin, isGoogleLoading, isSubmitting, isGoogleLocked, clickCount, lastClickTime]);

  const isFormDisabled = isSubmitting || isGoogleLoading;
  const isLoginDisabled = isFormDisabled || isLocked;
  const isGoogleDisabled = isFormDisabled || isGoogleLocked || clickCount > 5;

  return (
    <div className="space-y-3 lg:space-y-3">
      <button
        type="submit"
        disabled={isLoginDisabled}
        className={BUTTON_STYLES.primary}
        aria-label={isSubmitting ? 'Logging in...' : 'Log in to your account'}
      >
        {getLoginButtonText()}
      </button>

      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={isGoogleDisabled}
        className={BUTTON_STYLES.secondary}
        aria-label="Continue with Google"
      >
        <FcGoogle className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
        <span>{getGoogleButtonText()}</span>
      </button>
    </div>
  );
});
