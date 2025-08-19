"use client";

import { useCallback, useState, useTransition } from "react";
import type { UseFormReset } from "react-hook-form";
import { toast } from "sonner";
import { debounce } from "lodash";
import type { LoginFormData } from "@/app/schemas/loginSchema";
import { LoginResponseSchema, type LoginResponse } from "../types/authTypes";
import {
  API_CONFIG,
  API_ENDPOINTS,
  getApiUrl,
  rateLimiter,
} from "../utils/config";
import { handleAuthSuccess, getAuthHeaders } from "../utils/authHelpers";
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

  const debouncedLogin = useCallback(
    debounce(async (data: LoginFormData) => {
      if (!rateLimiter.canMakeRequest()) {
        const timeUntilReset = rateLimiter.getTimeUntilNextRequest();
        setIsRateLimited(true);
        handleRateLimitError(timeUntilReset);
        setTimeout(() => setIsRateLimited(false), timeUntilReset);
        return;
      }

      console.log("🔐 Initiating login process");

      startTransition(async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            API_CONFIG.timeout
          );

          const headers = await getAuthHeaders(true);
          console.log(
            "📡 Making login request to:",
            getApiUrl(API_ENDPOINTS.LOGIN)
          );
          console.log("📡 Request headers:", headers);

          const response = await fetch(getApiUrl(API_ENDPOINTS.LOGIN), {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            signal: controller.signal,
            // credentials: "include",
          });

          clearTimeout(timeoutId);

          console.log("📥 Response received:", {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
          });

          const contentType = response.headers.get("content-type");
          if (!contentType?.includes("application/json")) {
            console.error("❌ Server returned non-JSON response:", {
              status: response.status,
              contentType,
              headers: Object.fromEntries(response.headers.entries()),
            });

            // Try to get response text for debugging
            try {
              const responseText = await response.text();
              console.error(
                "📄 Response body:",
                responseText.substring(0, 1000)
              );
            } catch (e) {
              console.error("Could not read response body");
            }

            toast.error("Server configuration error. Please contact support.");
            return;
          }

          const result = await response.json();
          console.log("📊 Parsed response:", result);

          if (response.ok) {
            console.log("✅ Login successful");

            const validatedResult = LoginResponseSchema.parse(result);

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

            toast.success("✅ Logged in successfully!");
            reset();
            setRetryCount(0);
          } else {
            console.error("❌ Login failed - API returned error:", result);
            handleApiError(response, result);
            if (retryCount < API_CONFIG.maxRetries) {
              setRetryCount((prev) => prev + 1);
            }
          }
        } catch (error) {
          console.error("🚨 Login error - Enhanced debugging:", {
            errorType:
              error instanceof Error ? error.constructor.name : typeof error,
            errorMessage:
              error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
            isAbortError: error instanceof Error && error.name === "AbortError",
            isNetworkError:
              error instanceof Error && error.message.includes("fetch"),
            apiUrl: getApiUrl(API_ENDPOINTS.LOGIN),
            retryCount,
          });

          handleNetworkError(error, retryCount, API_CONFIG.maxRetries, "login");
          if (retryCount < API_CONFIG.maxRetries) {
            setRetryCount((prev) => prev + 1);
          }
        }
      });
    }, 500),
    [reset, router, retryCount]
  );

  const loginUser = useCallback(
    async (data: LoginFormData) => {
      if (isRateLimited) {
        toast.error("Please wait before trying again.");
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

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      await debouncedLogin(data);
    },
    [debouncedLogin, isRateLimited]
  );

  return {
    loginUser,
    retryCount,
    isPending,
    isRateLimited,
  };
}
