import { toast } from 'sonner';
import { 
  AuthenticationError, 
  TokenExpiredError, 
  NetworkError, 
  ValidationError,
  type AuthError 
} from '../types/authTypes';

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
  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  return sanitized;
};

export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    USER_NOT_FOUND: 'No account found with this email. Please sign up.',
    WRONG_PASSWORD: 'Password is incorrect. Please try again.',
    GOOGLE_SIGNUP_REQUIRED: 'Please use Google Sign In - you previously signed up with Google.',
    ACCOUNT_LOCKED: 'Account temporarily locked. Please try again later.',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  },
  NETWORK: {
    TIMEOUT: 'Request timed out. Please check your connection and try again.',
    OFFLINE: 'You appear to be offline. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    RATE_LIMITED: 'Too many requests. Please wait before trying again.',
  },
  VALIDATION: {
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PASSWORD: 'Password must meet security requirements.',
    REQUIRED_FIELD: 'This field is required.',
  },
  GOOGLE: {
    AUTH_FAILED: 'Google authentication failed. Please try again.',
    POPUP_BLOCKED: 'Google sign-in popup was blocked. Please allow popups and try again.',
    CANCELLED: 'Google sign-in was cancelled.',
    INVALID_CODE: 'Invalid Google authentication. Please try again.',
  },
} as const;

export const handleApiError = (res: Response, result: any): void => {
  console.error('API Error:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url,
    error: sanitizeErrorMessage(result?.error || 'Unknown error'),
  });

  let errorMessage: string;

  switch (res.status) {
    case 400:
      if (result.error?.toLowerCase().includes('google')) {
        errorMessage = ERROR_MESSAGES.AUTH.GOOGLE_SIGNUP_REQUIRED;
      } else if (result.error?.toLowerCase().includes('email')) {
        errorMessage = ERROR_MESSAGES.VALIDATION.INVALID_EMAIL;
      } else if (result.error?.toLowerCase().includes('password')) {
        errorMessage = ERROR_MESSAGES.AUTH.WRONG_PASSWORD;
      } else {
        errorMessage = ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
      }
      break;

    case 401:
      errorMessage = ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
      break;

    case 404:
      errorMessage = ERROR_MESSAGES.AUTH.USER_NOT_FOUND;
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
      errorMessage = result.error || ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
  }

  toast.error(errorMessage);
  
  // Throw appropriate error type for better error handling upstream
  if (res.status === 401) {
    throw new AuthenticationError(errorMessage, res.status);
  } else if (res.status === 422) {
    throw new ValidationError(errorMessage);
  } else if (res.status >= 500) {
    throw new NetworkError(errorMessage, res.status);
  }
};

// Enhanced Google authentication error handling
export const handleGoogleApiError = (res: Response, result: any): void => {
  console.error('Google API Error:', {
    status: res.status,
    statusText: res.statusText,
    error: sanitizeErrorMessage(result?.error || 'Unknown error'),
  });

  let errorMessage: string;

  switch (res.status) {
    case 400:
      errorMessage = ERROR_MESSAGES.GOOGLE.INVALID_CODE;
      break;

    case 401:
      errorMessage = ERROR_MESSAGES.GOOGLE.AUTH_FAILED;
      break;

    case 404:
      errorMessage = 'Google account not found. Please sign up first.';
      break;

    case 429:
      errorMessage = 'Too many Google authentication requests. Please wait and try again.';
      break;

    case 500:
    case 502:
    case 503:
    case 504:
      errorMessage = 'Google authentication service unavailable. Please try again later.';
      break;

    default:
      errorMessage = ERROR_MESSAGES.GOOGLE.AUTH_FAILED;
  }

  toast.error(errorMessage);
  throw new AuthenticationError(errorMessage, res.status);
};

// Enhanced network error handling with retry logic
export const handleNetworkError = (
  error: unknown, 
  retryCount: number, 
  maxRetries: number,
  context = 'login'
): void => {
  console.error('Network Error:', {
    error: sanitizeErrorMessage(error instanceof Error ? error.message : 'Unknown error'),
    retryCount,
    maxRetries,
    context,
  });
  
  let errorMessage: string;
  let shouldRetry = false;

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      errorMessage = ERROR_MESSAGES.NETWORK.TIMEOUT;
      shouldRetry = retryCount < maxRetries;
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage = navigator.onLine ? ERROR_MESSAGES.NETWORK.SERVER_ERROR : ERROR_MESSAGES.NETWORK.OFFLINE;
      shouldRetry = retryCount < maxRetries && navigator.onLine;
    } else if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
      errorMessage = 'Server returned invalid response. Please try again.';
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
    toast.info(`Retrying in ${retryDelay / 1000}s... (${retryCount + 1}/${maxRetries})`);
  }

  throw new NetworkError(errorMessage);
};

// Google-specific network error handling
export const handleGoogleNetworkError = (
  error: unknown, 
  retryCount: number, 
  maxRetries: number
): void => {
  console.error('Google Network Error:', {
    error: sanitizeErrorMessage(error instanceof Error ? error.message : 'Unknown error'),
    retryCount,
    maxRetries,
  });
  
  let errorMessage: string;

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      errorMessage = 'Google authentication timed out. Please try again.';
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage = navigator.onLine 
        ? 'Google authentication service unavailable. Please try again.' 
        : ERROR_MESSAGES.NETWORK.OFFLINE;
    } else if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
      errorMessage = 'Google authentication response was invalid. Please try again.';
    } else {
      errorMessage = ERROR_MESSAGES.GOOGLE.AUTH_FAILED;
    }
  } else {
    errorMessage = ERROR_MESSAGES.GOOGLE.AUTH_FAILED;
  }

  toast.error(errorMessage);

  if (retryCount < maxRetries) {
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    toast.info(`Retrying Google auth in ${retryDelay / 1000}s... (${retryCount + 1}/${maxRetries})`);
  }

  throw new NetworkError(errorMessage);
};

// Generic error boundary error handler
export const handleComponentError = (error: Error, errorInfo: any): void => {
  console.error('Component Error:', {
    error: sanitizeErrorMessage(error.message),
    componentStack: errorInfo.componentStack,
    stack: error.stack,
  });

  toast.error('Something went wrong. Please refresh the page and try again.');
};

// CSRF error handler
export const handleCSRFError = (): void => {
  console.error('CSRF validation failed');
  toast.error('Security validation failed. Please refresh the page and try again.');
  
  // Clear any potentially compromised state
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

// Rate limiting error handler
export const handleRateLimitError = (timeUntilReset: number): void => {
  const minutes = Math.ceil(timeUntilReset / 60000);
  toast.error(`Too many requests. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`);
};