import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { signUpSchema, SignUpFormData } from "@/app/schemas/signupSchema";
import { signUpUser, signUpWithGoogle } from "../services/authApi";
import { handleAuthSuccess } from "../utils/authHelpers";
import { handleApiError, handleGoogleApiError, handleNetworkError } from "../utils/errorHandlers";
import { MAX_RETRIES, GOOGLE_POPUP_TIMEOUT } from "../utils/constants";

export const useSignUp = (router: any) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googlePopupClosed, setGooglePopupClosed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const popupCheckInterval = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  useEffect(() => {
    return () => {
      if (popupCheckInterval.current) {
        clearInterval(popupCheckInterval.current);
      }
    };
  }, []);

  const validateFormData = useCallback((data: SignUpFormData): boolean => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return false;
    }

    if (!data.agreed) {
      setError("agreed", {
        type: "manual",
        message: "You must agree to the terms and conditions",
      });
      return false;
    }

    return true;
  }, [setError]);

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      if (!validateFormData(data)) return;

      console.log("📦 Signing up with:", { ...data, password: "[PROTECTED]" });

      try {
        const result = await signUpUser(data);
        console.log("✅ Sign up successful:", {
          ...result,
          user: { ...result.user, password: "[PROTECTED]" },
        });
        
        handleAuthSuccess(
          result.data?.token || result.token,
          result.data?.user || result.user,
          router
        );
        reset();
        setRetryCount(0);
      } catch (error: any) {
        if (error.response && error.data) {
          handleApiError(error.response, error.data);
        } else {
          handleNetworkError(error, retryCount, MAX_RETRIES, setRetryCount);
        }
      }
    },
    [validateFormData, reset, router, retryCount]
  );

  const handleGoogleAuth = useCallback(
    async (authResult: any) => {
      console.log("🔍 Google Auth initiated with code:", authResult.code);
      setIsGoogleLoading(true);
      setGooglePopupClosed(false);

      try {
        const result = await signUpWithGoogle(authResult.code);
        console.log("✅ Google signup successful:", {
          ...result,
          user: { ...result.user, password: "[PROTECTED]" },
        });
        
        handleAuthSuccess(
          result.data?.token || result.token,
          result.data?.user || result.user,
          router
        );
        setRetryCount(0);
      } catch (error: any) {
        if (error.response && error.data) {
          handleGoogleApiError(error.response, error.data);
        } else {
          handleNetworkError(error, retryCount, MAX_RETRIES, setRetryCount, true);
        }
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [router, retryCount]
  );

  const handleGoogleAuthError = useCallback((error: any) => {
    console.error("🚨 Google Auth Error:", error);
    toast.error(
      "Google authentication was cancelled or failed. Please try again."
    );
    setIsGoogleLoading(false);
    setGooglePopupClosed(true);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: handleGoogleAuthError,
    flow: "auth-code",
  });

  const handleGoogleSignup = useCallback(() => {
    console.log("🔍 Google signup clicked");
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
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    onSubmit,
    handleGoogleSignup,
    isGoogleLoading,
    googlePopupClosed,
    setError,
    clearErrors,
  };
};