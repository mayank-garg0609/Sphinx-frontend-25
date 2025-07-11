import { useCallback, useState, useRef, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { LoginResponse } from "../types/authTypes";
import { API_BASE_URL, MAX_RETRIES, GOOGLE_POPUP_TIMEOUT } from "../utils/constants";
import { handleAuthSuccess } from "../utils/authHelpers";
import { handleGoogleApiError, handleGoogleNetworkError } from "../utils/errorHandlers";

export const useGoogleAuth = (router: any, clearErrors: () => void) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googlePopupClosed, setGooglePopupClosed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const popupCheckInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (popupCheckInterval.current) {
        clearInterval(popupCheckInterval.current);
      }
    };
  }, []);

  const handleGoogleAuth = useCallback(
    async (authResult: any) => {
      console.log("🔍 Google Auth initiated with code:", authResult.code);
      setIsGoogleLoading(true);
      setGooglePopupClosed(false);

      try {
        const code = authResult.code;

        if (!code) {
          throw new Error("Google Auth code is missing");
        }

        const res = await fetch(`${API_BASE_URL}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("❌ Server returned non-JSON response:", res.status);
          toast.error("Server configuration error. Please try again later.");
          return;
        }

        const result: LoginResponse = await res.json();

        if (res.ok) {
          console.log("✅ Google login successful:", {
            ...result,
            user: { ...result.user, password: "[PROTECTED]" },
          });
          
          try {
            handleAuthSuccess(
              result.data?.token || result.token,
              result.data?.user || result.user,
              router
            );
            toast.success("✅ Logged in successfully!");
            setRetryCount(0);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Navigation failed");
          }
        } else {
          handleGoogleApiError(res, result);
          if (retryCount < MAX_RETRIES) {
            setRetryCount((prev) => prev + 1);
          }
        }
      } catch (err) {
        handleGoogleNetworkError(err, retryCount, MAX_RETRIES);
        if (retryCount < MAX_RETRIES) {
          setRetryCount((prev) => prev + 1);
        }
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [router, retryCount]
  );

  const handleGoogleAuthError = useCallback((error: any) => {
    console.error("🚨 Google Auth Error:", error);
    toast.error("Google authentication was cancelled or failed. Please try again.");
    setIsGoogleLoading(false);
    setGooglePopupClosed(true);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: handleGoogleAuthError,
    flow: "auth-code",
  });

  const handleGoogleLogin = useCallback(() => {
    console.log("🔍 Google login clicked");
    setIsGoogleLoading(true);
    setGooglePopupClosed(false);
    clearErrors();

    try {
      const checkPopupClosed = () => {
        setTimeout(() => {
          if (isGoogleLoading) {
            console.log("🔍 Checking if Google popup was closed...");
            setGooglePopupClosed(true);
            setIsGoogleLoading(false);
          }
        }, GOOGLE_POPUP_TIMEOUT);
      };

      checkPopupClosed();
      googleLogin();
    } catch (error) {
      console.error("🚨 Error initiating Google login:", error);
      setIsGoogleLoading(false);
      setGooglePopupClosed(true);
      toast.error("Failed to initiate Google login. Please try again.");
    }
  }, [googleLogin, isGoogleLoading, clearErrors]);

  return {
    isGoogleLoading,
    googlePopupClosed,
    handleGoogleLogin,
  };
};