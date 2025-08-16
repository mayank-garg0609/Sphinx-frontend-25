"use client";

import { useCallback, useState, useTransition } from "react";
import type { UseFormReset } from "react-hook-form";
import { toast } from "sonner";
import { debounce } from "lodash";
import type { SignUpFormData } from "@/app/schemas/signupSchema";
import { SignUpResponseSchema, type SignUpResponse } from "../types/authTypes";
import {
  API_CONFIG,
  API_ENDPOINTS,
  getApiUrl,
  rateLimiter,
} from "../utils/config";
import { handleAuthSuccess, getAuthHeaders } from "@/app/(auth)/login/utils/authHelpers";
import {
  handleApiError,
  handleNetworkError,
  handleRateLimitError,
} from "../utils/errorHandlers";

interface UseAuthReturn {
  signUpUser: (data: SignUpFormData) => Promise<void>;
  retryCount: number;
  isPending: boolean;
  isRateLimited: boolean;
}

export function useAuth(
  router: any,
  reset: UseFormReset<SignUpFormData>
): UseAuthReturn {
  const [retryCount, setRetryCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isRateLimited, setIsRateLimited] = useState(false);

  const debouncedSignUp = useCallback(
    debounce(async (data: SignUpFormData) => {
      if (!rateLimiter.canMakeRequest()) {
        const timeUntilReset = rateLimiter.getTimeUntilNextRequest();
        setIsRateLimited(true);
        handleRateLimitError(timeUntilReset);
        setTimeout(() => setIsRateLimited(false), timeUntilReset);
        return;
      }

      console.log("🔐 Initiating sign up process");

      startTransition(async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            API_CONFIG.timeout
          );

          const headers = await getAuthHeaders();

          const response = await fetch(getApiUrl(API_ENDPOINTS.SIGNUP), {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            signal: controller.signal,
            credentials: "include",
          });

          clearTimeout(timeoutId);

          const contentType = response.headers.get("content-type");
          if (!contentType?.includes("application/json")) {
            console.error(
              "❌ Server returned non-JSON response:",
              response.status
            );
            toast.error("Server configuration error. Please contact support.");
            return;
          }

          const result = await response.json();

          if (response.ok) {
            console.log("✅ Sign up successful");

            const validatedResult = SignUpResponseSchema.parse(result);

            let accessToken: string;
            let refreshToken: string;
            let expiresIn: number;
            let user: any;

            if (validatedResult.data) {
              accessToken = validatedResult.data.accessToken;
              refreshToken = validatedResult.data.refreshToken;
              expiresIn = validatedResult.data.expiresIn;
              user = validatedResult.data.user;
            } else {
              accessToken = validatedResult.accessToken!;
              refreshToken = validatedResult.refreshToken!;
              expiresIn = validatedResult.expiresIn!;
              user = validatedResult.user!;
            }

            await handleAuthSuccess(
              accessToken,
              refreshToken,
              expiresIn,
              user,
              router
            );

            toast.success("✅ Account created successfully!");
            reset();
            setRetryCount(0);
          } else {
            handleApiError(response, result);
            if (retryCount < API_CONFIG.maxRetries) {
              setRetryCount((prev) => prev + 1);
            }
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
        }
      });
    }, 500),
    [reset, router, retryCount]
  );

  const signUpUser = useCallback(
    async (data: SignUpFormData) => {
      if (isRateLimited) {
        toast.error("Please wait before trying again.");
        return;
      }

      // Client-side validation
      if (!data.name?.trim()) {
        toast.error("Name is required.");
        return;
      }

      if (!data.email?.trim()) {
        toast.error("Email is required.");
        return;
      }

      if (!data.password?.trim()) {
        toast.error("Password is required.");
        return;
      }

      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      if (!data.agreed) {
        toast.error("You must agree to the terms and conditions.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      if (data.password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }

      await debouncedSignUp(data);
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