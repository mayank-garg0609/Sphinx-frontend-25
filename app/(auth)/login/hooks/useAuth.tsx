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

          // Use minimal headers for login request
          const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
          };

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

            try {
              console.log("🔍 Raw response data:", result);
              
              const validatedResult = LoginResponseSchema.parse(result);
              console.log("🔍 Validated result:", validatedResult);

              const accessToken = validatedResult.accessToken!;
              const refreshToken = validatedResult.refreshToken!;
              const expiresIn = validatedResult.expiresIn!;
              const user = validatedResult.user!;

              console.log("🔑 Token data received:", {
                hasAccessToken: !!accessToken,
                hasRefreshToken: !!refreshToken,
                expiresIn: expiresIn,
                expiresInType: typeof expiresIn,
                userEmail: user?.email,
              });

              // Handle auth success with better error handling
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
              
            } catch (authError) {
              console.error("❌ Auth success handling failed:", authError);
              console.error("❌ Raw response that failed parsing:", result);
              
              try {
                let accessToken, refreshToken, expiresIn, user;
                
                if (result.data) {
                  accessToken = result.data.accessToken;
                  refreshToken = result.data.refreshToken;
                  expiresIn = typeof result.data.expiresIn === 'string' ? 
                    parseInt(result.data.expiresIn, 10) : result.data.expiresIn;
                  user = result.data.user;
                } else {
                  accessToken = result.accessToken;
                  refreshToken = result.refreshToken;
                  expiresIn = typeof result.expiresIn === 'string' ? 
                    parseInt(result.expiresIn, 10) : result.expiresIn;
                  user = result.user;
                }
                
                console.log("🔧 Manual extraction:", {
                  hasAccessToken: !!accessToken,
                  hasRefreshToken: !!refreshToken,
                  expiresIn,
                  hasUser: !!user,
                });
                
                if (accessToken && refreshToken && user) {
                  await handleAuthSuccess(
                    accessToken,
                    refreshToken,
                    expiresIn || 3600, // default to 1 hour
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
                console.error("❌ Manual extraction also failed:", manualError);
                toast.error("Login successful but setup failed. Please refresh and try again.");
              }
            }
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

          if (error instanceof Error && 
              (error.message.includes("Login successful but setup failed") ||
               error.message.includes("Auth success handling failed"))) {
            console.log("🟡 Login succeeded but post-processing failed - user should still be logged in");
            return; // Don't show network error toast
          }

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