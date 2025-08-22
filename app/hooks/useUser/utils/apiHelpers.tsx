import type { LoginFormData } from "@/app/schemas/loginSchema";
import type { SignUpFormData } from "@/app/schemas/signupSchema";
import { authManager } from "./authManager";
import { userManager } from "./userManager";
import type { User } from "../types/userCache";

// API Configuration
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''),
  timeout: 30000,
  maxRetries: 3,
  rateLimitWindow: 60000,
  maxRequestsPerWindow: 10,
} as const;

// Rate limiter
class RateLimiter {
  private requests: number[] = [];

  canMakeRequest(): boolean {
    const now = Date.now();
    const windowStart = now - API_CONFIG.rateLimitWindow;
    
    this.requests = this.requests.filter(timestamp => timestamp > windowStart);
    
    if (this.requests.length >= API_CONFIG.maxRequestsPerWindow) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const timeUntilExpiry = API_CONFIG.rateLimitWindow - (Date.now() - oldestRequest);
    
    return Math.max(0, timeUntilExpiry);
  }
}

const rateLimiter = new RateLimiter();

// Validation functions
export const validateLoginData = (data: LoginFormData): { isValid: boolean; error?: string } => {
  if (!data.email?.trim()) {
    return { isValid: false, error: "Email is required." };
  }

  if (!data.password?.trim()) {
    return { isValid: false, error: "Password is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  return { isValid: true };
};

export const validateSignUpData = (data: SignUpFormData): { isValid: boolean; error?: string } => {
  if (!data.name?.trim()) {
    return { isValid: false, error: "Name is required." };
  }

  if (!data.email?.trim()) {
    return { isValid: false, error: "Email is required." };
  }

  if (!data.password?.trim()) {
    return { isValid: false, error: "Password is required." };
  }

  if (data.password !== data.confirmPassword) {
    return { isValid: false, error: "Passwords do not match." };
  }

  if (!data.agreed) {
    return { isValid: false, error: "You must agree to the terms and conditions." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  if (data.password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long." };
  }

  return { isValid: true };
};

// API request wrapper
export const makeAuthRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  // Check rate limiting
  if (!rateLimiter.canMakeRequest()) {
    const timeUntilReset = rateLimiter.getTimeUntilNextRequest();
    throw {
      message: "Rate limited",
      isRateLimit: true,
      timeUntilReset,
    };
  }

  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    ...options,
  };

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw {
        message: "Request timed out. Please check your connection and try again.",
        shouldRetry: true,
      };
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw {
        message: navigator.onLine 
          ? "Server error. Please try again later." 
          : "You appear to be offline. Please check your connection.",
        shouldRetry: navigator.onLine,
      };
    }
    
    throw {
      message: "Network error occurred. Please try again.",
      shouldRetry: true,
    };
  }
};

// Handle authentication response
export const handleAuthResponse = async (
  response: Response, 
  type: 'login' | 'signup'
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw {
      message: "Server configuration error. Please contact support.",
      shouldRetry: false,
    };
  }

  const result = await response.json();

  if (!response.ok) {
    // Handle specific error cases
    let errorMessage: string;

    switch (response.status) {
      case 400:
        if (type === 'signup' && result.error?.toLowerCase().includes('user already exists')) {
          errorMessage = "An account with this email already exists. Please log in instead.";
        } else if (result.error?.toLowerCase().includes('google')) {
          errorMessage = type === 'login' 
            ? "Please use Google Sign In - you previously signed up with Google."
            : "Google authentication failed. Please try again.";
        } else {
          errorMessage = type === 'login' ? "Invalid email or password." : "Invalid registration data.";
        }
        break;
      case 401:
        errorMessage = "Invalid email or password. Please try again.";
        break;
      case 404:
        errorMessage = type === 'login' 
          ? "No account found with this email. Please sign up." 
          : "Registration endpoint not found.";
        break;
      case 409:
        errorMessage = "An account with this email already exists. Please log in instead.";
        break;
      case 422:
        errorMessage = "Please check your input and try again.";
        break;
      case 429:
        const timeUntilReset = rateLimiter.getTimeUntilNextRequest();
        throw {
          message: "Too many requests. Please wait before trying again.",
          isRateLimit: true,
          timeUntilReset,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = "Server error. Please try again later.";
        break;
      default:
        errorMessage = result.error || `${type === 'login' ? 'Login' : 'Registration'} failed. Please try again.`;
    }

    throw {
      message: errorMessage,
      shouldRetry: response.status >= 500,
    };
  }

  // Extract tokens and user data
  let accessToken: string;
  let refreshToken: string;
  let expiresIn: number;
  let user: User;

  try {
    if (result.data) {
      // Nested structure
      accessToken = result.data.accessToken;
      refreshToken = result.data.refreshToken;
      expiresIn = typeof result.data.expiresIn === 'string' 
        ? parseInt(result.data.expiresIn, 10) 
        : result.data.expiresIn;
      user = result.data.user;
    } else {
      // Flat structure
      accessToken = result.accessToken;
      refreshToken = result.refreshToken;
      expiresIn = typeof result.expiresIn === 'string' 
        ? parseInt(result.expiresIn, 10) 
        : result.expiresIn;
      user = result.user;
    }

    // Validate required fields
    if (!accessToken || !refreshToken || !user) {
      throw new Error("Missing required authentication data");
    }

    // Ensure expiresIn is valid
    if (isNaN(expiresIn) || expiresIn <= 0) {
      expiresIn = 3600; // Default to 1 hour
    }

    // Store tokens and user data
    authManager.setTokens(accessToken, refreshToken, expiresIn);
    userManager.setUser(user);

    console.log(`✅ ${type} successful:`, {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      expiresIn,
      userEmail: user.email
    });

    return { user, accessToken, refreshToken };

  } catch (error) {
    console.error(`❌ ${type} response processing failed:`, error);
    throw {
      message: `${type === 'login' ? 'Login' : 'Registration'} successful but setup failed. Please refresh and try again.`,
      shouldRetry: false,
    };
  }
};

// Process Google authentication
export const processGoogleAuth = async (code: string): Promise<{ user: User }> => {
  if (!code) {
    throw {
      message: "Google authentication code is missing",
      shouldRetry: false,
    };
  }

  const response = await makeAuthRequest('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw {
      message: "Server configuration error. Please contact support.",
      shouldRetry: false,
    };
  }

  const result = await response.json();

  if (!response.ok) {
    let errorMessage: string;

    switch (response.status) {
      case 400:
        errorMessage = "Invalid Google authentication. Please try again.";
        break;
      case 401:
        errorMessage = "Google authentication failed. Please try again.";
        break;
      case 409:
        errorMessage = "An account with this Google email already exists. Please log in instead.";
        break;
      case 429:
        const timeUntilReset = rateLimiter.getTimeUntilNextRequest();
        throw {
          message: "Too many Google authentication requests. Please wait and try again.",
          isRateLimit: true,
          timeUntilReset,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = "Google authentication service unavailable. Please try again later.";
        break;
      default:
        errorMessage = "Google authentication failed. Please try again.";
    }

    throw {
      message: errorMessage,
      shouldRetry: response.status >= 500,
    };
  }

  // Extract tokens and user data (same logic as regular auth)
  let accessToken: string;
  let refreshToken: string;
  let expiresIn: number;
  let user: User;

  try {
    if (result.data) {
      accessToken = result.data.accessToken;
      refreshToken = result.data.refreshToken;
      expiresIn = typeof result.data.expiresIn === 'string' 
        ? parseInt(result.data.expiresIn, 10) 
        : result.data.expiresIn;
      user = result.data.user;
    } else {
      accessToken = result.accessToken;
      refreshToken = result.refreshToken;
      expiresIn = typeof result.expiresIn === 'string' 
        ? parseInt(result.expiresIn, 10) 
        : result.expiresIn;
      user = result.user;
    }

    if (!accessToken || !refreshToken || !user) {
      throw new Error("Missing required authentication data");
    }

    if (isNaN(expiresIn) || expiresIn <= 0) {
      expiresIn = 3600;
    }

    // Store tokens and user data
    authManager.setTokens(accessToken, refreshToken, expiresIn);
    userManager.setUser(user);

    console.log("✅ Google authentication successful:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      expiresIn,
      userEmail: user.email
    });

    return { user };

  } catch (error) {
    console.error("❌ Google auth response processing failed:", error);
    throw {
      message: "Google authentication successful but setup failed. Please refresh and try again.",
      shouldRetry: false,
    };
  }
};