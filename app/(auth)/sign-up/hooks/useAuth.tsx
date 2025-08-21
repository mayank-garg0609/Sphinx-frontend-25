// app/(auth)/sign-up/hooks/useAuth.tsx (Fixed TypeScript errors)
"use client";

import { useCallback, useState, useTransition } from "react";
import type { UseFormReset } from "react-hook-form";
import { toast } from "sonner";
import { debounce } from "lodash";
import type { SignUpFormData } from "@/app/schemas/signupSchema";
import { LenientSignUpResponseSchema, type SignUpResponse } from "../types/authTypes";
import {
  API_CONFIG,
  API_ENDPOINTS,
  getApiUrl,
  rateLimiter,
} from "../utils/config";
import { handleAuthSuccess } from "@/app/(auth)/sign-up/utils/authHelpers";
import {
  handleApiError,
  handleNetworkError,
  handleRateLimitError,
} from "../utils/errorHandlers";

interface UseAuthReturn {
  signUpUser: (data: SignUpFormData) => Promise<boolean>;
  retryCount: number;
  isPending: boolean;
  isRateLimited: boolean;
}

const getSignupHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
  };
};

export function useAuth(
  router: any,
  reset: UseFormReset<SignUpFormData>
): UseAuthReturn {
  const [retryCount, setRetryCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isRateLimited, setIsRateLimited] = useState(false);

  const debouncedSignUp = useCallback(
    debounce(async (data: SignUpFormData): Promise<boolean> => {
      if (!rateLimiter.canMakeRequest()) {
        const timeUntilReset = rateLimiter.getTimeUntilNextRequest();
        setIsRateLimited(true);
        handleRateLimitError(timeUntilReset);
        setTimeout(() => setIsRateLimited(false), timeUntilReset);
        return false;
      }

      console.log("🔐 Initiating sign up process");

      return new Promise<boolean>((resolve) => {
        startTransition(async () => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
              () => controller.abort(),
              API_CONFIG.timeout
            );

            const headers = getSignupHeaders();

            const response = await fetch(getApiUrl(API_ENDPOINTS.SIGNUP), {
              method: "POST",
              headers,
              body: JSON.stringify(data),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const contentType = response.headers.get("content-type");
            if (!contentType?.includes("application/json")) {
              console.error(
                "❌ Server returned non-JSON response:",
                response.status
              );
              toast.error("Server configuration error. Please contact support.");
              resolve(false);
              return;
            }

            const result = await response.json();

            if (response.ok) {
              console.log("✅ Sign up successful");
              console.log("📦 Raw API response:", result);

              let validatedResult;
              try {
                validatedResult = LenientSignUpResponseSchema.parse(result);
              } catch (validationError) {
                console.error("❌ Response validation failed:", validationError);
                console.log("📦 Failed response data:", result);
                
                if (result.accessToken || (result.data && result.data.accessToken)) {
                  console.log("🔄 Using raw response data");
                  validatedResult = result;
                } else {
                  toast.error("Invalid response from server. Please try again.");
                  resolve(false);
                  return;
                }
              }

              let accessToken: string;
              let refreshToken: string;
              let expiresIn: number;
              let user: any;

              if (validatedResult.data) {
                accessToken = validatedResult.data.accessToken;
                refreshToken = validatedResult.data.refreshToken;
                expiresIn = typeof validatedResult.data.expiresIn === 'string' 
                  ? parseInt(validatedResult.data.expiresIn, 10) 
                  : validatedResult.data.expiresIn;
                user = validatedResult.data.user;
              } else {
                accessToken = validatedResult.accessToken!;
                refreshToken = validatedResult.refreshToken!;
                expiresIn = typeof validatedResult.expiresIn === 'string'
                  ? parseInt(validatedResult.expiresIn!, 10)
                  : validatedResult.expiresIn!;
                user = validatedResult.user!;
              }

              // Ensure expiresIn is a valid number
              if (isNaN(expiresIn) || expiresIn <= 0) {
                expiresIn = 3600; // Default to 1 hour
                console.warn("⚠️ Invalid expiresIn, using default value:", expiresIn);
              }

              console.log("🔑 Extracted tokens:", {
                hasAccessToken: !!accessToken,
                hasRefreshToken: !!refreshToken,
                expiresIn,
                hasUser: !!user
              });

              // Handle auth success - this will store tokens and user data
              // but won't navigate since we need OTP verification first
              await handleAuthSuccess(
                accessToken,
                refreshToken,
                expiresIn,
                user,
                router
              );

              toast.success("✅ Account created! Please verify your email.");
              reset();
              setRetryCount(0);
              resolve(true); // Indicate success so we can move to OTP step
            } else {
              handleApiError(response, result);
              if (retryCount < API_CONFIG.maxRetries) {
                setRetryCount((prev) => prev + 1);
              }
              resolve(false);
            }
          } catch (error) {
            console.error("🚨 Sign up error:", error);

            handleNetworkError(error, retryCount, API_CONFIG.maxRetries, "signup");
            if (retryCount < API_CONFIG.maxRetries) {
              setRetryCount((prev) => prev + 1);

              const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
              setTimeout(() => {
                console.log(`🔄 Retrying sign up (attempt ${retryCount + 1})`);
              }, retryDelay);
            }
            resolve(false);
          }
        });
      });
    }, 500),
    [reset, router, retryCount]
  );

  const signUpUser = useCallback(
    async (data: SignUpFormData): Promise<boolean> => {
      if (isRateLimited) {
        toast.error("Please wait before trying again.");
        return false;
      }

      // Client-side validation
      if (!data.name?.trim()) {
        toast.error("Name is required.");
        return false;
      }

      if (!data.email?.trim()) {
        toast.error("Email is required.");
        return false;
      }

      if (!data.password?.trim()) {
        toast.error("Password is required.");
        return false;
      }

      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match.");
        return false;
      }

      if (!data.agreed) {
        toast.error("You must agree to the terms and conditions.");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        toast.error("Please enter a valid email address.");
        return false;
      }

      if (data.password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return false;
      }

      // Ensure we always return a boolean
      try {
        const result = await debouncedSignUp(data);
        return result ?? false; // Convert null/undefined to false
      } catch (error) {
        console.error("Error in debouncedSignUp:", error);
        return false;
      }
    },
    [debouncedSignUp, isRateLimited]
  );

  return {
    signUpUser,
    retryCount,
    isPending,
    isRateLimited,
  };
}