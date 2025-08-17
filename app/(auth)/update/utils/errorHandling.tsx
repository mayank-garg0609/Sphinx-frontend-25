import { toast } from 'sonner';

export interface ErrorResponse {
  message: string;
  code?: string;
  status?: number;
  field?: string;
  details?: any;
}

export class RegistrationError extends Error {
  code?: string;
  status?: number;
  field?: string;

  constructor(message: string, code?: string, status?: number, field?: string) {
    super(message);
    this.name = 'RegistrationError';
    this.code = code;
    this.status = status;
    this.field = field;
  }
}

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
} as const;

export const ERROR_MESSAGES = {
  VALIDATION: {
    PHONE_INVALID: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9',
    PHONE_REQUIRED: 'Phone number is required',
    COLLEGE_NAME_REQUIRED: 'College name is required',
    CITY_REQUIRED: 'City is required',
    STATE_REQUIRED: 'State is required',
    COLLEGE_ID_REQUIRED: 'College ID is required',
    COLLEGE_ID_TOO_SHORT: 'College ID must be at least 5 characters long',
    COLLEGE_BRANCH_REQUIRED: 'Branch is required',
    GENDER_REQUIRED: 'Please select your gender',
    GENDER_INVALID: 'Please select a valid gender option',
  },
  NETWORK: {
    TIMEOUT: 'Request timed out. Please check your connection and try again.',
    OFFLINE: 'You appear to be offline. Please check your internet connection.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    CONNECTION_FAILED: 'Failed to connect to server. Please try again.',
  },
  AUTH: {
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NO_TOKEN: 'Authentication required. Please log in again.',
  },
  API: {
    PHONE_EXISTS: 'This phone number is already registered with another account.',
    COLLEGE_ID_EXISTS: 'This college ID is already registered with another account.',
    INVALID_DATA: 'Please check all fields and try again.',
    PROFILE_COMPLETE: 'Your profile is already complete.',
    RATE_LIMITED: 'Too many requests. Please wait a moment before trying again.',
  },
  GENERAL: {
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    SUBMISSION_FAILED: 'Failed to submit registration. Please try again.',
  },
} as const;

// Enhanced error handler that provides better user feedback
export const handleRegistrationError = (
  error: unknown,
  context: string = 'registration'
): ErrorResponse => {
  console.error(`[${context}] Error occurred:`, error);

  // Handle RegistrationError instances
  if (error instanceof RegistrationError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      field: error.field,
    };
  }

  // Handle network/fetch errors
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return {
        message: ERROR_MESSAGES.NETWORK.TIMEOUT,
        code: ERROR_CODES.TIMEOUT_ERROR,
        status: 408,
      };
    }

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      const message = navigator.onLine 
        ? ERROR_MESSAGES.NETWORK.CONNECTION_FAILED
        : ERROR_MESSAGES.NETWORK.OFFLINE;
      
      return {
        message,
        code: ERROR_CODES.NETWORK_ERROR,
        status: 0,
      };
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
      return {
        message: 'Server returned an invalid response. Please try again.',
        code: ERROR_CODES.SERVER_ERROR,
        status: 500,
      };
    }
  }

  // Default error response
  return {
    message: ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR,
    code: ERROR_CODES.SERVER_ERROR,
    status: 500,
  };
};

// Show appropriate toast based on error type
export const showErrorToast = (errorResponse: ErrorResponse): void => {
  const { message, code, field } = errorResponse;

  switch (code) {
    case ERROR_CODES.VALIDATION_ERROR:
      toast.error(message, {
        duration: 5000,
        description: field ? `Please check the ${field} field` : undefined,
      });
      break;

    case ERROR_CODES.NETWORK_ERROR:
    case ERROR_CODES.TIMEOUT_ERROR:
      toast.error(message, {
        duration: 6000,
        action: {
          label: 'Retry',
          onClick: () => {
            // This would trigger a retry - implementation depends on context
            console.log('Retry requested');
          },
        },
      });
      break;

    case ERROR_CODES.AUTH_ERROR:
      toast.error(message, {
        duration: 4000,
        description: 'You will be redirected to login',
      });
      break;

    case ERROR_CODES.CONFLICT_ERROR:
      toast.error(message, {
        duration: 8000,
        description: 'Please use different information and try again',
      });
      break;

    case ERROR_CODES.RATE_LIMIT_ERROR:
      toast.warning(message, {
        duration: 10000,
        description: 'Please wait before submitting again',
      });
      break;

    default:
      toast.error(message, {
        duration: 5000,
      });
  }
};

// Validate form data client-side
export const validateRegistrationData = (data: any): ErrorResponse[] => {
  const errors: ErrorResponse[] = [];

  // Phone validation
  if (!data.phone_no?.trim()) {
    errors.push({
      message: ERROR_MESSAGES.VALIDATION.PHONE_REQUIRED,
      code: ERROR_CODES.VALIDATION_ERROR,
      field: 'phone_no',
    });
  } else {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.phone_no)) {
      errors.push({
        message: ERROR_MESSAGES.VALIDATION.PHONE_INVALID,
        code: ERROR_CODES.VALIDATION_ERROR,
        field: 'phone_no',
      });
    }
  }

  // Required field validations
  const requiredFields = [
    { key: 'college_name', message: ERROR_MESSAGES.VALIDATION.COLLEGE_NAME_REQUIRED },
    { key: 'city', message: ERROR_MESSAGES.VALIDATION.CITY_REQUIRED },
    { key: 'state', message: ERROR_MESSAGES.VALIDATION.STATE_REQUIRED },
    { key: 'college_id', message: ERROR_MESSAGES.VALIDATION.COLLEGE_ID_REQUIRED },
    { key: 'college_branch', message: ERROR_MESSAGES.VALIDATION.COLLEGE_BRANCH_REQUIRED },
    { key: 'gender', message: ERROR_MESSAGES.VALIDATION.GENDER_REQUIRED },
  ];

  requiredFields.forEach(({ key, message }) => {
    if (!data[key]?.trim()) {
      errors.push({
        message,
        code: ERROR_CODES.VALIDATION_ERROR,
        field: key,
      });
    }
  });

  // College ID length validation
  if (data.college_id && data.college_id.trim().length < 5) {
    errors.push({
      message: ERROR_MESSAGES.VALIDATION.COLLEGE_ID_TOO_SHORT,
      code: ERROR_CODES.VALIDATION_ERROR,
      field: 'college_id',
    });
  }

  // Gender validation
  if (data.gender && !['male', 'female', 'other'].includes(data.gender.toLowerCase())) {
    errors.push({
      message: ERROR_MESSAGES.VALIDATION.GENDER_INVALID,
      code: ERROR_CODES.VALIDATION_ERROR,
      field: 'gender',
    });
  }

  return errors;
};

// Sanitize error message for logging (remove sensitive data)
export const sanitizeErrorMessage = (message: string): string => {
  const sensitivePatterns = [
    /token/gi,
    /jwt/gi,
    /bearer/gi,
    /authorization/gi,
    /cookie/gi,
    /session/gi,
    /password/gi,
    /secret/gi,
  ];

  let sanitized = message;
  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  return sanitized;
};

// Get user-friendly error message based on HTTP status
export const getStatusMessage = (status: number, defaultMessage?: string): string => {
  switch (status) {
    case 400:
      return 'Invalid data provided. Please check all fields.';
    case 401:
      return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
    case 403:
      return 'Access denied. Please contact support.';
    case 404:
      return 'Service not found. Please try again later.';
    case 409:
      return 'Duplicate information detected. Please use different details.';
    case 422:
      return 'Validation failed. Please check all required fields.';
    case 429:
      return ERROR_MESSAGES.API.RATE_LIMITED;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.NETWORK.SERVER_ERROR;
    default:
      return defaultMessage || ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;
  }
};