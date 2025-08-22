"use client";

import { useCallback, useState, useTransition, useMemo, useRef,useEffect } from "react";
import type { UseFormReset } from "react-hook-form";
import { toast } from "sonner";
import type { LoginFormData } from "@/app/schemas/loginSchema";
import { LoginResponseSchema } from "../types/authTypes";
import {
  API_CONFIG,
  API_ENDPOINTS,
  getApiUrl,
  rateLimiter,
} from "../utils/config";
import { handleAuthSuccess } from "../utils/authHelpers";
import {
  handleApiError,
  handleNetworkError,
  handleRateLimitError,
} from "../utils/errorHandlers";

interface UseAuthReturn {
  loginUser: (data: LoginFormData) => Promise<void>;
  retryCount: number;
  isPending: boolean;
  isRateLimited: boolean;
}

export function useAuth(
  router: any,
  reset: UseFormReset<LoginFormData>
): UseAuthReturn {
  const [retryCount, setRetryCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  // Use refs to prevent unnecessary re-renders
  const abortControllerRef = useRef<AbortController | null>(null);
  const rateLimitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized headers to prevent recreation
  const requestHeaders = useMemo(() => ({
    "Content-Type": "application/json",
    "Accept": "application/json",
  }), []);

  // Optimized rate limit handler
  const handleRateLimit = useCallback(() => {
    const timeUntilReset = rateLimiter.getTimeUntilNextRequest();
    setIsRateLimited(true);
    handleRateLimitError(timeUntilReset);
    
    // Clear existing timeout
    if (rateLimitTimeoutRef.current) {
      clearTimeout(rateLimitTimeoutRef.current);
    }
    
    rateLimitTimeoutRef.current = setTimeout(() => {
      setIsRateLimited(false);
      rateLimitTimeoutRef.current = null;
    }, timeUntilReset);
  }, []);

  // Optimized validation
  const validateInput = useCallback((data: LoginFormData): boolean => {
    if (!data.email?.trim()) {
      toast.error("Email is required.");
      return false;
    }

    if (!data.password?.trim()) {
      toast.error("Password is required.");
      return false;
    }

    // Pre-compiled regex for better performance
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    return true;
  }, []);

  const loginUser = useCallback(async (data: LoginFormData) => {
    if (isRateLimited) {
      toast.error("Please wait before trying again.");
      return;
    }

    if (!rateLimiter.canMakeRequest()) {
      handleRateLimit();
      return;
    }

    if (!validateInput(data)) {
      return;
    }

    console.log("🔐 Initiating login process");

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    startTransition(async () => {
      try {
        abortControllerRef.current = new AbortController();
        const timeoutId = setTimeout(
          () => abortControllerRef.current?.abort(),
          API_CONFIG.timeout
        );

        console.log("📡 Making login request to:", getApiUrl(API_ENDPOINTS.LOGIN));

        const response = await fetch(getApiUrl(API_ENDPOINTS.LOGIN), {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify(data),
          signal: abortControllerRef.current.signal,
        });

        clearTimeout(timeoutId);

        console.log("📥 Response received:", {
          status: response.status,
          ok: response.ok,
        });

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          console.error("❌ Server returned non-JSON response");
          toast.error("Server configuration error. Please contact support.");
          return;
        }

        const result = await response.json();

        if (response.ok) {
          console.log("✅ Login successful");

          try {
            const validatedResult = LoginResponseSchema.parse(result);
            
            await handleAuthSuccess(
              validatedResult.accessToken!,
              validatedResult.refreshToken!,
              validatedResult.expiresIn!,
              validatedResult.user!,
              router
            );

            toast.success("✅ Logged in successfully!");
            reset();
            setRetryCount(0);
            
          } catch (authError) {
            console.error("❌ Auth success handling failed:", authError);
            
            // Fallback manual extraction
            try {
              let accessToken, refreshToken, expiresIn, user;
              
              if (result.data) {
                ({ accessToken, refreshToken, expiresIn, user } = result.data);
              } else {
                ({ accessToken, refreshToken, expiresIn, user } = result);
              }
              
              // Type conversion for expiresIn
              if (typeof expiresIn === 'string') {
                expiresIn = parseInt(expiresIn, 10);
              }
              
              if (accessToken && refreshToken && user) {
                await handleAuthSuccess(
                  accessToken,
                  refreshToken,
                  expiresIn || 3600,
                  user,
                  router
                );
                
                toast.success("✅ Logged in successfully!");
                reset();
                setRetryCount(0);
              } else {
                throw new Error("Missing required auth data");
              }
            } catch (manualError) {
              console.error("❌ Manual extraction failed:", manualError);
              toast.error("Login successful but setup failed. Please refresh and try again.");
            }
          }
        } else {
          console.error("❌ Login failed:", result);
          handleApiError(response, result);
          if (retryCount < API_CONFIG.maxRetries) {
            setRetryCount(prev => prev + 1);
          }
        }
      } catch (error) {
        console.error("🚨 Login error:", error);

        // Don't show network error for auth processing failures
        if (error instanceof Error && 
            (error.message.includes("Login successful but setup failed") ||
             error.message.includes("Auth success handling failed"))) {
          return;
        }

        handleNetworkError(error, retryCount, API_CONFIG.maxRetries, "login");
        if (retryCount < API_CONFIG.maxRetries) {
          setRetryCount(prev => prev + 1);
        }
      } finally {
        abortControllerRef.current = null;
      }
    });
  }, [isRateLimited, validateInput, handleRateLimit, requestHeaders, reset, router, retryCount]);

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
    loginUser,
    retryCount,
    isPending,
    isRateLimited,
  };
}