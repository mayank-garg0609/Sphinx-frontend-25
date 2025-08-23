// app/(auth)/sign-up/utils/errorHandlers.tsx - UPDATED for new API flow
import { toast } from "sonner";
import {
  AuthenticationError,
  TokenExpiredError,
  NetworkError,
  ValidationError,
  type AuthError,
} from "../types/authTypes";

const sanitizeErrorMessage = (message: string): string => {
  const sensitivePatterns = [
    /token/gi,
    /jwt/gi,
    /bearer/gi,
    /authorization/gi,
    /cookie/gi,
    /session/gi,
  ];

  let sanitized = message;
  sensitivePatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  });

  return sanitized;
};

export const ERROR_MESSAGES = {
  AUTH: {
    USER_EXISTS:
      "An account with this email already exists. Please log in instead.",
    INVALID_PASSWORD: "Password must be at least 8 characters long.",
    INVALID_EMAIL: "Please enter a valid email address.",
    WEAK_PASSWORD:
      "Password is too weak. Please include uppercase, lowercase, numbers, and special characters.",
    GOOGLE_SIGNUP_FAILED: "Google sign-up failed. Please try again.",
    ACCOUNT_CREATION_FAILED: "Failed to create account. Please try again.",
    TERMS_NOT_AGREED: "You must agree to the terms and conditions.",
    PASSWORD_MISMATCH: "Passwords do not match.",
  },
  NETWORK: {
    TIMEOUT: "Request timed out. Please check your connection and try again.",
    OFFLINE: "You appear to be offline. Please check your connection.",
    SERVER_ERROR: "Server error. Please try again later.",
    RATE_LIMITED: "Too many requests. Please wait before trying again.",
  },
  VALIDATION: {
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_PASSWORD: "Password must meet security requirements.",
    REQUIRED_FIELD: "This field is required.",
    NAME_TOO_SHORT: "Name must be at least 2 characters long.",
    NAME_TOO_LONG: "Name must be no longer than 50 characters.",
  },
  GOOGLE: {
    AUTH_FAILED: "Google sign-up failed. Please try again.",
    POPUP_BLOCKED:
      "Google sign-up popup was blocked. Please allow popups and try again.",
    CANCELLED: "Google sign-up was cancelled.",
    INVALID_CODE: "Invalid Google authentication. Please try again.",
    ACCOUNT_EXISTS:
      "An account with this Google email already exists. Please log in instead.",
  },
  OTP: {
    SEND_FAILED: "Failed to send OTP. Please try again.",
    VERIFY_FAILED: "Failed to verify OTP. Please try again.",
    INVALID_FORMAT: "OTP must be a 6-digit number.",
    EXPIRED: "OTP has expired. Please request a new one.",
    USER_NOT_FOUND: "User not found. Please sign up first.",
    USER_ALREADY_EXISTS: "An account with this email already exists. Please log in instead.",
    USER_ALREADY_VERIFIED: "Your email is already verified. You can proceed to login.",
    RESEND_TOO_SOON: "Please wait before requesting another OTP.",
    MAX_ATTEMPTS: "Too many failed attempts. Please request a new OTP.",
  },
} as const;

// Updated for new API error handling
export const handleApiError = (res: Response, result: any): void => {
  console.error("API Error:", {
    status: res.status,
    statusText: res.statusText,
    url: res.url,
    error: sanitizeErrorMessage(result?.error || "Unknown error"),
  });

  let errorMessage: string;

  // Handle OTP send errors (POST /auth/signup)
  if (res.url?.includes('/auth/signup')) {
    switch (res.status) {
      case 404:
        if (result.error === "User already exists") {
          errorMessage = ERROR_MESSAGES.OTP.USER_ALREADY_EXISTS;
        } else {
          errorMessage = ERROR_MESSAGES.OTP.SEND_FAILED;
        }
        break;
      case 500:
        errorMessage = result.error || ERROR_MESSAGES.OTP.SEND_FAILED;
        break;
      default:
        errorMessage = result.error || ERROR_MESSAGES.OTP.SEND_FAILED;
    }
  }
  // Handle OTP verify errors (POST /auth/verify)
  else if (res.url?.includes('/auth/verify')) {
    switch (res.status) {
      case 401:
        if (result.error === "User already exist") {
          errorMessage = ERROR_MESSAGES.OTP.USER_ALREADY_EXISTS;
        } else {
          errorMessage = ERROR_MESSAGES.AUTH.ACCOUNT_CREATION_FAILED;
        }
        break;
      case 400:
        if (result.error === "Invalid or expired OTP") {
          errorMessage = ERROR_MESSAGES.OTP.EXPIRED;
        } else {
          errorMessage = ERROR_MESSAGES.OTP.VERIFY_FAILED;
        }
        break;
      case 500:
        errorMessage = result.error || ERROR_MESSAGES.OTP.VERIFY_FAILED;
        break;
      default:
        errorMessage = result.error || ERROR_MESSAGES.OTP.VERIFY_FAILED;
    }
  }
  // Handle other API errors
  else {
    switch (res.status) {
      case 400:
        if (
          result.error?.toLowerCase().includes("user already exists") ||
          result.error?.toLowerCase().includes("email already")
        ) {
          errorMessage = ERROR_MESSAGES.AUTH.USER_EXISTS;
        } else if (result.error?.toLowerCase().includes("google")) {
          errorMessage = ERROR_MESSAGES.AUTH.GOOGLE_SIGNUP_FAILED;
        } else if (result.error?.toLowerCase().includes("password")) {
          errorMessage = ERROR_MESSAGES.AUTH.INVALID_PASSWORD;
        } else if (result.error?.toLowerCase().includes("email")) {
          errorMessage = ERROR_MESSAGES.VALIDATION.INVALID_EMAIL;
        } else {
          errorMessage = ERROR_MESSAGES.AUTH.ACCOUNT_CREATION_FAILED;
        }
        break;

      case 409:
        errorMessage = ERROR_MESSAGES.AUTH.USER_EXISTS;
        break;

      case 422:
        errorMessage = ERROR_MESSAGES.VALIDATION.INVALID_EMAIL;
        break;

      case 429:
        errorMessage = ERROR_MESSAGES.NETWORK.RATE_LIMITED;
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = ERROR_MESSAGES.NETWORK.SERVER_ERROR;
        break;

      default:
        errorMessage = result.error || ERROR_MESSAGES.AUTH.ACCOUNT_CREATION_FAILED;
    }
  }

  toast.error(errorMessage);

  if (res.status === 409 || res.status === 401) {
    throw new AuthenticationError(errorMessage, res.status);
  } else if (res.status === 422) {
    throw new ValidationError(errorMessage);
  } else if (res.status >= 500) {
    throw new NetworkError(errorMessage, res.status);
  }
};

export const handleGoogleApiError = (res: Response, result: any): void => {
  console.error("Google SignUp API Error:", {
    status: res.status,
    statusText: res.statusText,
    error: sanitizeErrorMessage(result?.error || "Unknown error"),
  });

  let errorMessage: string;

  switch (res.status) {
    case 400:
      if (
        result.error?.toLowerCase().includes("user already exists") ||
        result.error?.toLowerCase().includes("email already")
      ) {
        errorMessage = ERROR_MESSAGES.GOOGLE.ACCOUNT_EXISTS;
      } else {
        errorMessage = ERROR_MESSAGES.GOOGLE.INVALID_CODE;
      }
      break;

    case 409:
      errorMessage = ERROR_MESSAGES.GOOGLE.ACCOUNT_EXISTS;
      break;

    case 429:
      errorMessage =
        "Too many Google sign-up requests. Please wait and try again.";
      break;

    case 500:
    case 502:
    case 503:
    case 504:
      errorMessage =
        "Google sign-up service unavailable. Please try again later.";
      break;

    default:
      errorMessage = ERROR_MESSAGES.GOOGLE.AUTH_FAILED;
  }

  toast.error(errorMessage);
  throw new AuthenticationError(errorMessage, res.status);
};

export const handleNetworkError = (
  error: unknown,
  retryCount: number,
  maxRetries: number,
  context = "signup"
): void => {
  console.error("Network Error:", {
    error: sanitizeErrorMessage(
      error instanceof Error ? error.message : "Unknown error"
    ),
    retryCount,
    maxRetries,
    context,
  });

  let errorMessage: string;
  let shouldRetry = false;

  if (error instanceof Error) {
    if (error.name === "AbortError") {
      errorMessage = ERROR_MESSAGES.NETWORK.TIMEOUT;
      shouldRetry = retryCount < maxRetries;
    } else if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      errorMessage = navigator.onLine
        ? ERROR_MESSAGES.NETWORK.SERVER_ERROR
        : ERROR_MESSAGES.NETWORK.OFFLINE;
      shouldRetry = retryCount < maxRetries && navigator.onLine;
    } else if (
      error instanceof SyntaxError &&
      error.message.includes("Unexpected token")
    ) {
      errorMessage = "Server returned invalid response. Please try again.";
      shouldRetry = false; // Don't retry parsing errors
    } else {
      errorMessage = ERROR_MESSAGES.NETWORK.SERVER_ERROR;
      shouldRetry = retryCount < maxRetries;
    }
  } else {
    errorMessage = ERROR_MESSAGES.NETWORK.SERVER_ERROR;
    shouldRetry = retryCount < maxRetries;
  }

  toast.error(errorMessage);

  if (shouldRetry) {
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff, max 10s
    toast.info(
      `Retrying in ${retryDelay / 1000}s... (${retryCount + 1}/${maxRetries})`
    );
  }

  throw new NetworkError(errorMessage);
};

export const handleGoogleNetworkError = (
  error: unknown,
  retryCount: number,
  maxRetries: number
): void => {
  console.error("Google SignUp Network Error:", {
    error: sanitizeErrorMessage(
      error instanceof Error ? error.message : "Unknown error"
    ),
    retryCount,
    maxRetries,
  });

  let errorMessage: string;

  if (error instanceof Error) {
    if (error.name === "AbortError") {
      errorMessage = "Google sign-up timed out. Please try again.";
    } else if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      errorMessage = navigator.onLine
        ? "Google sign-up service unavailable. Please try again."
        : ERROR_MESSAGES.NETWORK.OFFLINE;
    } else if (
      error instanceof SyntaxError &&
      error.message.includes("Unexpected token")
    ) {
      errorMessage = "Google sign-up response was invalid. Please try again.";
    } else {
      errorMessage = ERROR_MESSAGES.GOOGLE.AUTH_FAILED;
    }
  } else {
    errorMessage = ERROR_MESSAGES.GOOGLE.AUTH_FAILED;
  }

  toast.error(errorMessage);

  if (retryCount < maxRetries) {
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    toast.info(
      `Retrying Google sign-up in ${retryDelay / 1000}s... (${
        retryCount + 1
      }/${maxRetries})`
    );
  }

  throw new NetworkError(errorMessage);
};

export const handleComponentError = (error: Error, errorInfo: any): void => {
  console.error("SignUp Component Error:", {
    error: sanitizeErrorMessage(error.message),
    componentStack: errorInfo.componentStack,
    stack: error.stack,
  });

  toast.error("Something went wrong. Please refresh the page and try again.");
};

export const handleCSRFError = (): void => {
  console.error("CSRF validation failed");
  toast.error(
    "Security validation failed. Please refresh the page and try again."
  );
  if (typeof window !== "undefined") {
    window.location.reload();
  }
};

export const handleRateLimitError = (timeUntilReset: number): void => {
  const minutes = Math.ceil(timeUntilReset / 60000);
  toast.error(
    `Too many requests. Please wait ${minutes} minute${
      minutes > 1 ? "s" : ""
    } before trying again.`
  );
};

// OTP-specific error handlers
export const handleOTPSendError = (error: unknown): string => {
  let errorMessage: string;
  
  if (error instanceof Error) {
    switch (error.message) {
      case "User already exists":
      case "An account with this email already exists. Please log in instead.":
        errorMessage = ERROR_MESSAGES.OTP.USER_ALREADY_EXISTS;
        break;
      case "Failed to send OTP":
      case "Failed to send OTP. Please try again later.":
        errorMessage = ERROR_MESSAGES.OTP.SEND_FAILED;
        break;
      default:
        if (error.message.includes("fetch") || error.message.includes("network")) {
          errorMessage = ERROR_MESSAGES.NETWORK.SERVER_ERROR;
        } else {
          errorMessage = error.message || ERROR_MESSAGES.OTP.SEND_FAILED;
        }
    }
  } else {
    errorMessage = ERROR_MESSAGES.OTP.SEND_FAILED;
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
      case "User already exist":
      case "An account with this email already exists. Please log in instead.":
        errorMessage = ERROR_MESSAGES.OTP.USER_ALREADY_EXISTS;
        break;
      case "Invalid or expired OTP":
      case "Invalid or expired OTP. Please try again or request a new OTP.":
        errorMessage = ERROR_MESSAGES.OTP.EXPIRED;
        break;
      case "Failed to verify user":
      case "Failed to verify user. Please try again later.":
        errorMessage = ERROR_MESSAGES.OTP.VERIFY_FAILED;
        break;
      case "Valid 6-digit OTP is required":
        errorMessage = ERROR_MESSAGES.OTP.INVALID_FORMAT;
        break;
      default:
        if (error.message.includes("fetch") || error.message.includes("network")) {
          errorMessage = ERROR_MESSAGES.NETWORK.SERVER_ERROR;
        } else {
          errorMessage = error.message || ERROR_MESSAGES.OTP.VERIFY_FAILED;
        }
    }
  } else {
    errorMessage = ERROR_MESSAGES.OTP.VERIFY_FAILED;
  }

  console.error("OTP Verify Error:", {
    originalError: error instanceof Error ? error.message : String(error),
    mappedError: errorMessage,
  });

  return errorMessage;
};