import { toast } from 'sonner';

export const handleApiError = (res: Response, result: any): void => {
  console.error('❌ Server error:', result);

  const errorMessages: Record<number, string> = {
    404: 'User not found. Please check your email or sign up.',
    401: 'Invalid password. Please try again.',
    422: 'Validation failed. Please check your input and try again.',
    429: 'Too many login attempts. Please wait a moment and try again.',
    500: 'Server error. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
  };

  if (res.status === 400) {
    if (result.error?.includes('Google')) {
      toast.error('You signed up using Google. Please log in with Google Auth.');
    } else if (result.error?.includes('email')) {
      toast.error('Invalid email address. Please check and try again.');
    } else if (result.error?.includes('password')) {
      toast.error('Password is incorrect. Please try again.');
    } else {
      toast.error(result.error || 'Invalid credentials. Please try again.');
    }
  } else {
    toast.error(errorMessages[res.status] || result.error || 'Login failed. Please try again.');
  }
};

export const handleGoogleApiError = (res: Response, result: any): void => {
  console.error('❌ Google login failed:', result);

  const googleErrorMessages: Record<number, string> = {
    400: 'Invalid Google authentication code. Please try again.',
    401: 'Google authentication expired. Please try again.',
    404: 'Google account not found. Please sign up first.',
    429: 'Too many Google auth requests. Please wait and try again.',
    500: 'Failed to authenticate with Google. Please try again.',
  };

  toast.error(
    googleErrorMessages[res.status] || 
    result.error || 
    'Google authentication failed. Please try again.'
  );
};

export const handleNetworkError = (
  error: unknown, 
  retryCount: number, 
  maxRetries: number
): void => {
  console.error('🚨 Network error:', error);
  
  if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
    toast.error('Server returned invalid response. Please check if the API endpoint exists.');
  } else if (error instanceof Error && error.name === 'AbortError') {
    toast.error('Request timed out. Please check your connection and try again.');
  } else {
    toast.error('Network error. Please check your connection and try again.');
  }

  if (retryCount < maxRetries) {
    toast.info(`Retrying... (${retryCount + 1}/${maxRetries})`);
  }
};

export const handleGoogleNetworkError = (
  error: unknown, 
  retryCount: number, 
  maxRetries: number
): void => {
  console.error('🚨 Google Auth error:', error);
  
  if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
    toast.error('Server returned invalid response. Please check if the Google auth endpoint exists.');
  } else if (error instanceof Error && error.name === 'AbortError') {
    toast.error('Google authentication timed out. Please try again.');
  } else {
    toast.error('Google authentication failed. Please try again.');
  }

  if (retryCount < maxRetries) {
    toast.info(`Retrying Google auth... (${retryCount + 1}/${maxRetries})`);
  }
};