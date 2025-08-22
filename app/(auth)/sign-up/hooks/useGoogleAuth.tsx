import { useCallback, useState, useRef, useEffect, useTransition } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import type { SignUpResponse } from "../types/authTypes";
import { API_CONFIG, rateLimiter } from "../utils/config";
import { handleAuthSuccess } from "@/app/(auth)/sign-up/utils/authHelpers";
import {
  handleGoogleApiError,
  handleGoogleNetworkError,
  handleRateLimitError,
} from "../utils/errorHandlers";

interface UseGoogleAuthReturn {
  isGoogleLoading: boolean;
  googlePopupClosed: boolean;
  handleGoogleSignup: () => void;
  isRateLimited: boolean;
  error: string | null;
}

// Simple headers for Google signup - no auth needed
const getGoogleSignupHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
  };
};

export function useGoogleAuth(
  router: any, // This should be the transition router
  clearErrors: () => void
): UseGoogleAuthReturn {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googlePopupClosed, setGooglePopupClosed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleGoogleAuth = useCallback(
    async (authResult: { code: string }) => {
      console.log("🔍 Google SignUp Auth initiated");
      setIsGoogleLoading(true);
      setGooglePopupClosed(false);
      setError(null);

      if (!rateLimiter.canMakeRequest()) {
        const timeUntilReset = rateLimiter.getTimeUntilNextRequest();
        setIsRateLimited(true);
        handleRateLimitError(timeUntilReset);

        setTimeout(() => setIsRateLimited(false), timeUntilReset);
        setIsGoogleLoading(false);
        return;
      }

      startTransition(async () => {
        try {
          const { code } = authResult;

          if (!code) {
            throw new Error("Google Auth code is missing");
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            API_CONFIG.timeout
          );

          // Use simple headers for Google signup - no auth required
          const headers = getGoogleSignupHeaders();

          const response = await fetch(`${API_CONFIG.baseUrl}/auth/google`, {
            method: "POST",
            headers,
            body: JSON.stringify({ code }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          const contentType = response.headers.get("content-type");
          if (!contentType?.includes("application/json")) {
            console.error(
              "❌ Server returned non-JSON response:",
              response.status
            );
            setError("Server configuration error. Please try again later.");
            toast.error("Server configuration error. Please try again later.");
            return;
          }

          const result: SignUpResponse = await response.json();

          if (response.ok) {
            console.log("✅ Google sign up successful");

            let accessToken: string;
            let refreshToken: string;
            let expiresIn: number;
            let user: any;

            if (result.data) {
              accessToken = result.data.accessToken;
              refreshToken = result.data.refreshToken;
              expiresIn = result.data.expiresIn;
              user = result.data.user;
            } else {
              accessToken = result.accessToken!;
              refreshToken = result.refreshToken!;
              expiresIn = result.expiresIn!;
              user = result.user!;
            }

            // Handle auth success and store tokens/user data
            await handleAuthSuccess(
              accessToken,
              refreshToken,
              expiresIn,
              user,
              router
            );

            toast.success("✅ Account created successfully with Google!");
            
            // Use transition router for smooth navigation
            console.log("🔄 Navigating to profile completion with transition...");
            
            // Small delay to allow toast to show, then navigate with transition
            setTimeout(() => {
              if (router && typeof router.push === 'function') {
                router.push("/update");
                console.log("✅ Navigation initiated with transition router");
              } else {
                console.warn("⚠️ Router not available, falling back to window location");
                window.location.href = "/update";
              }
            }, 1500);
            
            setRetryCount(0);
            setError(null);
          } else {
            handleGoogleApiError(response, result);
            setError(result.error || "Google sign-up failed");
            if (retryCount < API_CONFIG.maxRetries) {
              setRetryCount((prev) => prev + 1);
            }
          }
        } catch (error) {
          console.error("🚨 Google SignUp Error:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Google sign-up failed";
          setError(errorMessage);
          handleGoogleNetworkError(error, retryCount, API_CONFIG.maxRetries);
          if (retryCount < API_CONFIG.maxRetries) {
            setRetryCount((prev) => prev + 1);
          }
        } finally {
          setIsGoogleLoading(false);
        }
      });
    },
    [router, retryCount]
  );

  const handleGoogleAuthError = useCallback((error: any) => {
    console.error("🚨 Google SignUp Error:", error);
    const errorMessage =
      "Google sign-up was cancelled or failed. Please try again.";
    setError(errorMessage);
    toast.error(errorMessage);
    setIsGoogleLoading(false);
    setGooglePopupClosed(true);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: handleGoogleAuthError,
    flow: "auth-code",
  });

  const handleGoogleSignup = useCallback(() => {
    if (isRateLimited) {
      toast.error("Please wait before trying Google sign-up again.");
      return;
    }

    console.log("🔍 Google sign-up clicked");
    setIsGoogleLoading(true);
    setGooglePopupClosed(false);
    setError(null);
    clearErrors();

    try {
      timeoutRef.current = setTimeout(() => {
        if (isGoogleLoading) {
          setGooglePopupClosed(true);
          setIsGoogleLoading(false);
        }
      }, API_CONFIG.googlePopupTimeout);

      googleLogin();
    } catch (error) {
      console.error("🚨 Error initiating Google sign-up:", error);
      const errorMessage =
        "Failed to initiate Google sign-up. Please try again.";
      setError(errorMessage);
      setIsGoogleLoading(false);
      setGooglePopupClosed(true);
      toast.error(errorMessage);
    }
  }, [googleLogin, isGoogleLoading, clearErrors, isRateLimited]);

  return {
    isGoogleLoading: isGoogleLoading || isPending,
    googlePopupClosed,
    handleGoogleSignup,
    isRateLimited,
    error,
  };
}