// app/(auth)/sign-up/utils/otpErrorHandlers.tsx
import { toast } from "sonner";

export const OTP_ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found. Please sign up first.",
  USER_ALREADY_VERIFIED: "Your email is already verified. You can proceed to login.",
  USER_DETAILS_INCOMPLETE: "Please complete your profile first.",
  INVALID_OR_EXPIRED_OTP: "Invalid or expired OTP. Please try again.",
  FAILED_TO_SEND_OTP: "Failed to send OTP. Please try again later.",
  FAILED_TO_VERIFY_OTP: "Failed to verify OTP. Please try again.",
  AUTH_TOKEN_REQUIRED: "Authentication required. Please sign up first.",
  INVALID_OTP_FORMAT: "OTP must be a 6-digit number.",
  OTP_TOO_SHORT: "Please enter the complete 6-digit OTP.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  RATE_LIMITED: "Too many attempts. Please wait before trying again.",
} as const;

export const handleOTPSendError = (error: unknown): string => {
  let errorMessage: string;
  
  if (error instanceof Error) {
    switch (error.message) {
      case "User not found":
        errorMessage = OTP_ERROR_MESSAGES.USER_NOT_FOUND;
        break;
      case "User already verified":
        errorMessage = OTP_ERROR_MESSAGES.USER_ALREADY_VERIFIED;
        break;
      case "User details not complete":
        errorMessage = OTP_ERROR_MESSAGES.USER_DETAILS_INCOMPLETE;
        break;
      case "Failed to resend OTP":
        errorMessage = OTP_ERROR_MESSAGES.FAILED_TO_SEND_OTP;
        break;
      case "Authentication token is required":
        errorMessage = OTP_ERROR_MESSAGES.AUTH_TOKEN_REQUIRED;
        break;
      default:
        if (error.message.includes("fetch")) {
          errorMessage = OTP_ERROR_MESSAGES.NETWORK_ERROR;
        } else {
          errorMessage = error.message || OTP_ERROR_MESSAGES.FAILED_TO_SEND_OTP;
        }
    }
  } else {
    errorMessage = OTP_ERROR_MESSAGES.FAILED_TO_SEND_OTP;
  }

  console.error("OTP Send Error:", {
    originalError: error instanceof Error ? error.message : String(error),
    mappedError: errorMessage,
  });

  return errorMessage;
};

export const handleOTPVerifyError = (error: unknown): string => {
  let errorMessage: string;
  
  if (error instanceof Error) {
    switch (error.message) {
      case "User not found":
        errorMessage = OTP_ERROR_MESSAGES.USER_NOT_FOUND;
        break;
      case "Invalid or expired OTP":
        errorMessage = OTP_ERROR_MESSAGES.INVALID_OR_EXPIRED_OTP;
        break;
      case "Failed to verify OTP":
        errorMessage = OTP_ERROR_MESSAGES.FAILED_TO_VERIFY_OTP;
        break;
      case "Authentication token is required":
        errorMessage = OTP_ERROR_MESSAGES.AUTH_TOKEN_REQUIRED;
        break;
      case "OTP must be a 6-digit number":
        errorMessage = OTP_ERROR_MESSAGES.INVALID_OTP_FORMAT;
        break;
      default:
        if (error.message.includes("fetch")) {
          errorMessage = OTP_ERROR_MESSAGES.NETWORK_ERROR;
        } else {
          errorMessage = error.message || OTP_ERROR_MESSAGES.FAILED_TO_VERIFY_OTP;
        }
    }
  } else {
    errorMessage = OTP_ERROR_MESSAGES.FAILED_TO_VERIFY_OTP;
  }

  console.error("OTP Verify Error:", {
    originalError: error instanceof Error ? error.message : String(error),
    mappedError: errorMessage,
  });

  return errorMessage;
};

export const handleOTPValidationError = (otp: string[]): string | null => {
  const otpString = otp.join('');
  
  if (otpString.length === 0) {
    return "Please enter the OTP sent to your email.";
  }
  
  if (otpString.length < 6) {
    return OTP_ERROR_MESSAGES.OTP_TOO_SHORT;
  }
  
  if (!/^\d{6}$/.test(otpString)) {
    return OTP_ERROR_MESSAGES.INVALID_OTP_FORMAT;
  }
  
  return null; // No validation error
};

export const handleOTPNetworkError = (error: unknown): string => {
  let errorMessage: string;
  
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      errorMessage = "Request timed out. Please try again.";
    } else if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError") ||
      error.message.includes("ERR_NETWORK")
    ) {
      errorMessage = navigator.onLine
        ? OTP_ERROR_MESSAGES.SERVER_ERROR
        : "You appear to be offline. Please check your connection.";
    } else if (
      error instanceof SyntaxError &&
      error.message.includes("Unexpected token")
    ) {
      errorMessage = "Server returned invalid response. Please try again.";
    } else {
      errorMessage = OTP_ERROR_MESSAGES.NETWORK_ERROR;
    }
  } else {
    errorMessage = OTP_ERROR_MESSAGES.NETWORK_ERROR;
  }

  console.error("OTP Network Error:", {
    originalError: error instanceof Error ? error.message : String(error),
    mappedError: errorMessage,
    isOnline: navigator.onLine,
  });

  return errorMessage;
};

export const showOTPSuccessMessage = (type: 'send' | 'verify', email?: string): void => {
  switch (type) {
    case 'send':
      toast.success(email ? `OTP sent to ${email}` : "OTP sent successfully!");
      break;
    case 'verify':
      toast.success("✅ Email verified successfully!");
      break;
  }
};

export const showOTPErrorToast = (error: unknown, context: 'send' | 'verify'): string => {
  let errorMessage: string;
  
  switch (context) {
    case 'send':
      errorMessage = handleOTPSendError(error);
      break;
    case 'verify':
      errorMessage = handleOTPVerifyError(error);
      break;
    default:
      errorMessage = "An error occurred. Please try again.";
  }
  
  toast.error(errorMessage);
  return errorMessage;
};

// Rate limiting helpers for OTP
export const isOTPRateLimited = (lastRequestTime: number, cooldownMs: number = 60000): boolean => {
  return Date.now() - lastRequestTime < cooldownMs;
};

export const getOTPCooldownTime = (lastRequestTime: number, cooldownMs: number = 60000): number => {
  const elapsed = Date.now() - lastRequestTime;
  return Math.max(0, cooldownMs - elapsed);
};

export const formatCooldownTime = (milliseconds: number): string => {
  const seconds = Math.ceil(milliseconds / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
};