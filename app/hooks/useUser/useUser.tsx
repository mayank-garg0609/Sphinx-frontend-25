"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { debounce } from "lodash";
import type { LoginFormData } from "@/app/schemas/loginSchema";
import type { SignUpFormData } from "@/app/schemas/signupSchema";
import { 
  getUserData, 
  isUserLoggedIn, 
  getAuthStatus, 
  refreshUserSession, 
  logoutUser as logoutUserUtil,
  getValidAuthToken,
  getAuthHeaders as getAuthHeadersUtil
} from "./utils/helperFunctions";
import { userManager } from "./utils/userManager";
import { authManager } from "./utils/authManager";
import { UserData, AuthStatus } from "./types/userCache";

// Import API utilities
import { 
  validateLoginData,
  validateSignUpData,
  makeAuthRequest,
  handleAuthResponse,
  processGoogleAuth
} from "./utils/apiHelpers";

export interface AuthMethods {
  // Login methods
  loginWithCredentials: (data: LoginFormData) => Promise<void>;
  loginWithGoogle: (code: string) => Promise<void>;
  
  // Signup methods
  signUpWithCredentials: (data: SignUpFormData) => Promise<void>;
  signUpWithGoogle: (code: string) => Promise<void>;
  
  // Session management
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Utility methods
  checkAuthStatus: () => boolean;
  getAuthHeaders: () => Promise<Record<string, string>>;
  updateUserData: (updates: Partial<UserData>) => void;
}

export interface UseUserReturn {
  // User state
  user: UserData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  authStatus: AuthStatus;
  
  // Auth methods
  auth: AuthMethods;
  
  // Loading states for different operations
  loginLoading: boolean;
  signupLoading: boolean;
  googleLoading: boolean;
  
  // Error states
  loginError: string | null;
  signupError: string | null;
  googleError: string | null;
  
  // Rate limiting
  isRateLimited: boolean;
  
  // Retry counts
  loginRetryCount: number;
  signupRetryCount: number;
}

export const useUser = (): UseUserReturn => {
  // Core state
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    hasValidToken: false,
    tokenExpiry: null,
  });

  // Loading states
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Error states
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Rate limiting and retry
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [loginRetryCount, setLoginRetryCount] = useState(0);
  const [signupRetryCount, setSignupRetryCount] = useState(0);

  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const rateLimitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial user data
  const loadUserData = useCallback(() => {
    try {
      const userData = getUserData();
      const loggedIn = isUserLoggedIn();
      const currentAuthStatus = getAuthStatus();

      setUser(userData);
      setIsLoggedIn(loggedIn);
      setAuthStatus(currentAuthStatus);

      console.log("📊 User data loaded:", {
        hasUser: !!userData,
        isLoggedIn: loggedIn,
        authStatus: currentAuthStatus
      });
    } catch (error) {
      console.error("Failed to load user data:", error);
      setUser(null);
      setIsLoggedIn(false);
      setAuthStatus({
        isAuthenticated: false,
        hasValidToken: false,
        tokenExpiry: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setLoginError(null);
    setSignupError(null);
    setGoogleError(null);
  }, []);

  // Handle rate limiting
  const handleRateLimit = useCallback((timeUntilReset: number) => {
    setIsRateLimited(true);
    const minutes = Math.ceil(timeUntilReset / 60000);
    toast.error(`Too many requests. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`);
    
    rateLimitTimeoutRef.current = setTimeout(() => {
      setIsRateLimited(false);
    }, timeUntilReset);
  }, []);

  // Login with credentials
  const loginWithCredentials = useCallback(async (data: LoginFormData) => {
    if (isRateLimited || loginLoading) return;

    // Validate input
    const validation = validateLoginData(data);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setLoginLoading(true);
    setLoginError(null);
    clearErrors();

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await makeAuthRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        signal: abortControllerRef.current.signal
      });

      const result = await handleAuthResponse(response, 'login');
      
      // Success
      setUser(result.user);
      setIsLoggedIn(true);
      setAuthStatus(getAuthStatus());
      setLoginRetryCount(0);
      
      toast.success("✅ Logged in successfully!");
      
      // Navigate after a brief delay
      setTimeout(() => {
        window.location.href = "/profile";
      }, 500);

    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message);
      
      if (error.shouldRetry && loginRetryCount < 3) {
        setLoginRetryCount(prev => prev + 1);
      }
      
      if (error.isRateLimit) {
        handleRateLimit(error.timeUntilReset);
      }
    } finally {
      setLoginLoading(false);
      abortControllerRef.current = null;
    }
  }, [isRateLimited, loginLoading, loginRetryCount, clearErrors, handleRateLimit]);

  // Signup with credentials
  const signUpWithCredentials = useCallback(async (data: SignUpFormData) => {
    if (isRateLimited || signupLoading) return;

    // Validate input
    const validation = validateSignUpData(data);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setSignupLoading(true);
    setSignupError(null);
    clearErrors();

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await makeAuthRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        signal: abortControllerRef.current.signal
      });

      const result = await handleAuthResponse(response, 'signup');
      
      // Success
      setUser(result.user);
      setIsLoggedIn(true);
      setAuthStatus(getAuthStatus());
      setSignupRetryCount(0);
      
      toast.success("✅ Account created successfully!");
      
      // Navigate after a brief delay
      setTimeout(() => {
        window.location.href = "/profile";
      }, 500);

    } catch (error: any) {
      console.error("Signup error:", error);
      setSignupError(error.message);
      
      if (error.shouldRetry && signupRetryCount < 3) {
        setSignupRetryCount(prev => prev + 1);
      }
      
      if (error.isRateLimit) {
        handleRateLimit(error.timeUntilReset);
      }
    } finally {
      setSignupLoading(false);
      abortControllerRef.current = null;
    }
  }, [isRateLimited, signupLoading, signupRetryCount, clearErrors, handleRateLimit]);

  // Google authentication (login or signup)
  const handleGoogleAuth = useCallback(async (code: string, mode: 'login' | 'signup') => {
    if (isRateLimited || googleLoading) return;

    setGoogleLoading(true);
    setGoogleError(null);
    clearErrors();

    try {
      const result = await processGoogleAuth(code);
      
      // Success
      setUser(result.user);
      setIsLoggedIn(true);
      setAuthStatus(getAuthStatus());
      
      const successMessage = mode === 'login' 
        ? "✅ Logged in successfully with Google!" 
        : "✅ Account created successfully with Google!";
      toast.success(successMessage);
      
      // Navigate after a brief delay
      setTimeout(() => {
        window.location.href = "/profile";
      }, 500);

    } catch (error: any) {
      console.error("Google auth error:", error);
      setGoogleError(error.message);
      
      if (error.isRateLimit) {
        handleRateLimit(error.timeUntilReset);
      }
    } finally {
      setGoogleLoading(false);
    }
  }, [isRateLimited, googleLoading, clearErrors, handleRateLimit]);

  // Individual Google methods
  const loginWithGoogle = useCallback(async (code: string) => {
    return handleGoogleAuth(code, 'login');
  }, [handleGoogleAuth]);

  const signUpWithGoogle = useCallback(async (code: string) => {
    return handleGoogleAuth(code, 'signup');
  }, [handleGoogleAuth]);

  // Session management
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const sessionValid = await refreshUserSession();
      if (sessionValid) {
        loadUserData();
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setAuthStatus({
          isAuthenticated: false,
          hasValidToken: false,
          tokenExpiry: null,
        });
      }
      return sessionValid;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      return false;
    }
  }, [loadUserData]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await logoutUserUtil();
      setUser(null);
      setIsLoggedIn(false);
      setAuthStatus({
        isAuthenticated: false,
        hasValidToken: false,
        tokenExpiry: null,
      });
      clearErrors();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Failed to logout user:", error);
      throw error;
    }
  }, [clearErrors]);

  // Check auth status
  const checkAuthStatus = useCallback((): boolean => {
    return authManager.isAuthenticated();
  }, []);

  // Get auth headers
  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    return getAuthHeadersUtil();
  }, []);

  // Update user data
  const updateUserData = useCallback((updates: Partial<UserData>) => {
    try {
      userManager.updateUser(updates);
      const updatedUser = userManager.getUser();
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  }, []);

  // Auth methods object
  const authMethods: AuthMethods = {
    loginWithCredentials,
    loginWithGoogle,
    signUpWithCredentials,
    signUpWithGoogle,
    refreshSession,
    logout,
    checkAuthStatus,
    getAuthHeaders,
    updateUserData
  };

  // Initialize user data on mount
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Token expiry monitoring
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkTokenExpiry = () => {
      const currentAuthStatus = getAuthStatus();
      setAuthStatus(currentAuthStatus);

      if (currentAuthStatus.tokenExpiry) {
        const timeUntilExpiry = currentAuthStatus.tokenExpiry - Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
          console.log("🔄 Token expiring soon, refreshing session");
          refreshSession();
        }
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn, refreshSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (rateLimitTimeoutRef.current) {
        clearTimeout(rateLimitTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Core state
    user,
    isLoggedIn,
    isLoading,
    authStatus,
    
    // Auth methods
    auth: authMethods,
    
    // Loading states
    loginLoading,
    signupLoading,
    googleLoading,
    
    // Error states
    loginError,
    signupError,
    googleError,
    
    // Rate limiting
    isRateLimited,
    
    // Retry counts
    loginRetryCount,
    signupRetryCount,
  };
};