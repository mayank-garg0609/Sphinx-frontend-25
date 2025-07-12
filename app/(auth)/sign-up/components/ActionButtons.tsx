import { memo } from "react";
import { FcGoogle } from "react-icons/fc";
import { BUTTON_STYLES } from "../utils/constants";

interface ActionButtonsProps {
  isSubmitting: boolean;
  onGoogleSignup: () => void;
  isGoogleLoading: boolean;
  googlePopupClosed: boolean;
}

export const ActionButtons = memo(function ActionButtons({
  isSubmitting,
  onGoogleSignup,
  isGoogleLoading,
  googlePopupClosed,
}: ActionButtonsProps) {
  const getGoogleButtonText = () => {
    if (googlePopupClosed) return "Sign up with Google";
    if (isGoogleLoading) return "Authenticating...";
    return "Continue with Google";
  };

  return (
    <div className="space-y-3 lg:space-y-3">
      <button
        type="submit"
        disabled={isSubmitting || isGoogleLoading}
        className={BUTTON_STYLES.primary}
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>

      <button
        type="button"
        onClick={onGoogleSignup}
        disabled={isGoogleLoading || isSubmitting}
        className={BUTTON_STYLES.secondary}
      >
        <FcGoogle className="w-4 h-4 lg:w-5 lg:h-5" />
        <span>{getGoogleButtonText()}</span>
      </button>
    </div>
  );
});