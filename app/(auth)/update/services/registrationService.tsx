import { toast } from "sonner";
import { RegisterFormData } from "../types/registrations";
import { getValidAuthToken } from "@/app/hooks/useUser/utils/helperFunctions";
import { API_CONFIG } from "../../login/utils/config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_CONFIG.baseUrl;

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class RegistrationError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'RegistrationError';
    this.code = code;
    this.status = status;
  }
}

const handleApiError = (response: Response, result: any): never => {
  console.error('Registration API Error:', {
    status: response.status,
    statusText: response.statusText,
    error: result?.error || result?.message || 'Unknown error',
  });

  let errorMessage: string;
  let errorCode: string = 'API_ERROR';

  switch (response.status) {
    case 400:
      if (result.error?.toLowerCase().includes('phone')) {
        errorMessage = 'Invalid phone number format. Please check and try again.';
        errorCode = 'PHONE_INVALID';
      } else if (result.error?.toLowerCase().includes('college')) {
        errorMessage = 'Invalid college information. Please check your details.';
        errorCode = 'COLLEGE_INVALID';
      } else if (result.error?.toLowerCase().includes('already')) {
        errorMessage = 'Your profile is already complete. Redirecting...';
        errorCode = 'PROFILE_COMPLETE';
      } else {
        errorMessage = result.error || result.message || 'Invalid registration data. Please check all fields.';
        errorCode = 'VALIDATION_ERROR';
      }
      break;

    case 401:
      errorMessage = 'Authentication required. Please log in again.';
      errorCode = 'AUTH_ERROR';
      break;

    case 403:
      errorMessage = 'You are not authorized to perform this action.';
      errorCode = 'AUTH_ERROR';
      break;

    case 409:
      errorMessage = 'Phone number or college ID already exists. Please use different details.';
      errorCode = 'CONFLICT_ERROR';
      break;

    case 422:
      errorMessage = 'Validation failed. Please check all required fields.';
      errorCode = 'VALIDATION_ERROR';
      break;

    case 429:
      errorMessage = 'Too many requests. Please wait a moment before trying again.';
      errorCode = 'RATE_LIMIT_ERROR';
      break;

    case 500:
    case 502:
    case 503:
    case 504:
      errorMessage = 'Server error. Please try again later.';
      errorCode = 'SERVER_ERROR';
      break;

    default:
      errorMessage = result.error || result.message || 'Registration failed. Please try again.';
      errorCode = 'UNKNOWN_ERROR';
  }

  throw new RegistrationError(errorMessage, errorCode, response.status);
};

const validateFormData = (data: RegisterFormData): void => {
  const errors: string[] = [];

  // Phone number validation
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(data.phone_no)) {
    errors.push('Phone number must be a valid 10-digit Indian mobile number');
  }

  // Required field validation
  const requiredFields: (keyof RegisterFormData)[] = [
    'college_name', 'city', 'state', 'college_id', 'college_branch', 'gender'
  ];

  requiredFields.forEach(field => {
    if (!data[field]?.trim()) {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  // College ID validation (basic format check)
  if (data.college_id && data.college_id.length < 5) {
    errors.push('College ID must be at least 5 characters long');
  }

  // Gender validation
  if (data.gender && !['male', 'female', 'other'].includes(data.gender.toLowerCase())) {
    errors.push('Please select a valid gender option');
  }

  if (errors.length > 0) {
    throw new RegistrationError(errors[0], 'VALIDATION_ERROR', 422);
  }
};

export const registerUser = async (
  data: RegisterFormData
): Promise<RegistrationResponse> => {
  try {
    console.log('🚀 Starting user registration process');
    
    // Validate form data
    validateFormData(data);

    // Get auth token
    const token = await getValidAuthToken();
    if (!token) {
      throw new RegistrationError(
        'Authentication required. Please log in again.', 
        'AUTH_ERROR', 
        401
      );
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    console.log('📤 Sending registration request to:', `${API_BASE_URL}/user/register`);

    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      signal: controller.signal,
      credentials: 'include',
    });

    clearTimeout(timeoutId);

    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error('❌ Server returned non-JSON response:', response.status);
      throw new RegistrationError(
        'Server configuration error. Please contact support.', 
        'SERVER_ERROR', 
        response.status
      );
    }

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Registration successful:', result);
      return {
        success: true,
        message: result.message || 'Profile updated successfully!',
        data: result.data || result,
      };
    } else {
      handleApiError(response, result);
      // This line will never be reached because handleApiError throws
      // But TypeScript needs a return statement for the function signature
      return {
        success: false,
        message: 'API error occurred',
        error: 'API_ERROR',
      };
    }
  } catch (error) {
    console.error('❌ Registration error:', error);

    if (error instanceof RegistrationError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      };
    }

    // Handle network errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timed out. Please check your connection and try again.',
          error: 'TIMEOUT_ERROR',
        };
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return {
          success: false,
          message: navigator.onLine 
            ? 'Server is temporarily unavailable. Please try again later.'
            : 'You appear to be offline. Please check your connection.',
          error: 'NETWORK_ERROR',
        };
      }
    }

    return {
      success: false,
      message: 'Registration failed. Please try again.',
      error: 'UNKNOWN_ERROR',
    };
  }
};

// Additional utility function for checking registration status
export const checkRegistrationStatus = async (): Promise<{ isComplete: boolean; missingFields?: string[] }> => {
  try {
    const token = await getValidAuthToken();
    if (!token) {
      return { isComplete: false };
    }

    const response = await fetch(`${API_BASE_URL}/user/registration-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const result = await response.json();
      return {
        isComplete: result.isComplete || false,
        missingFields: result.missingFields || [],
      };
    }

    return { isComplete: false };
  } catch (error) {
    console.error('Failed to check registration status:', error);
    return { isComplete: false };
  }
};