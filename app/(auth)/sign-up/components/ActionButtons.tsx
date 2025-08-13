'use client';

import { memo, useCallback } from 'react';
import { FcGoogle } from 'react-icons/fc';

interface ActionButtonsProps {
  readonly isSubmitting: boolean;
  readonly onGoogleSignup: () => void;
  readonly isGoogleLoading: boolean;
  readonly googlePopupClosed: boolean;
}

export const ActionButtons = memo(function ActionButtons({
  isSubmitting,
  onGoogleSignup,
  isGoogleLoading,
  googlePopupClosed,
}: ActionButtonsProps) {
  const getGoogleButtonText = useCallback(() => {
    if (googlePopupClosed) return 'Continue with Google';
    if (isGoogleLoading) return 'Authenticating...';
    return 'Continue with Google';
  }, [googlePopupClosed, isGoogleLoading]);

  return (
    <div className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-3 xl:space-y-4 2xl:space-y-5">
      <button
        type="submit"
        disabled={isSubmitting || isGoogleLoading}
        className="w-full bg-white text-black font-semibold py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isSubmitting ? 'Creating account...' : 'Create your account'}
      >
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </button>

      <button
        type="button"
        onClick={onGoogleSignup}
        disabled={isGoogleLoading || isSubmitting}
        className="w-full flex items-center justify-center border border-white text-white font-medium py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 rounded-lg hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Continue with Google"
      >
        <FcGoogle className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" aria-hidden="true" />
        <span>{getGoogleButtonText()}</span>
      </button>
    </div>
  );
});