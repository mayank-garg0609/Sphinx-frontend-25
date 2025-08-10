// app/(auth)/sign-up/hooks/useSignUp.tsx - UPDATED VERSION
import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { signUpSchema, SignUpFormData } from "@/app/schemas/signupSchema";
import { signUpUser, signUpWithGoogle } from "../services/authApi";
import { handleAuthSuccess } from "../utils/authHelpers";
import { handleApiError, handleGoogleApiError, handleNetworkError } from "../utils/errorHandlers";
import { SECURITY_CONFIG } from "../../utils/security";
import { rateLimiter } from "../../utils/validation";
import { sessionSecurity } from "../../utils/sessionSecurity";

export const useSignUp = (router: any) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googlePopupClosed, setGooglePopupClosed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const popupCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef<string>('');

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
    console.log('🔍 Performing client-side validation');
    
    try {
      // Rate limiting check
      const rateLimitId = `signup:${data.email}`;
      if (rateLimiter.isBlocked(rateLimitId)) {
        const remainingTime = rateLimiter.getRemainingTime(rateLimitId);
        toast.error(`Too many signup attempts. Please wait ${Math.ceil(remainingTime / 1000)} seconds.`);
        return false;
      }
      
      // Record attempt
      const rateResult = rateLimiter.recordAttempt(rateLimitId);
      if (rateResult.blocked) {
        toast.error(`Too many signup attempts. Please wait ${Math.ceil(rateResult.blockDuration! / 1000)} seconds.`);
        return false;
      }
      
      // Password confirmation check
      if (data.password !== data.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
        return false;
      }

      // Terms agreement check
      if (!data.agreed) {
        setError("agreed", {
          type: "manual",
          message: "You must agree to the terms and conditions",
        });
        return false;
      }
      
      // Additional client-side security checks
      if (data.password.length > SECURITY_CONFIG.password.maxLength) {
        setError("password", {
          type: "manual",
          message: "Password is too long",
        });
        return false;
      }
      
      console.log('✅ Client-side validation passed');
      return true;
      
    } catch (error) {
      console.error('❌ Validation error:', error);
      toast.error('Validation failed. Please check your input.');
      return false;
    }
  }, [setError]);

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      const requestId = generateRequestId();
      console.log(`📦 [${requestId}] Starting signup process`);

      if (!validateFormData(data)) return;

      try {
        const result = await signUpUser(data);
        console.log(`✅ [${requestId}] Signup successful`);
        
        // Extend session on successful signup
        sessionSecurity.extendSession();
        
        handleAuthSuccess(
          result.data?.token || result.token,
          result.data?.user || result.user,
          router
        );
        reset();
        setRetryCount(0);
      } catch (error: any) {
        console.error(`❌ [${requestId}] Signup failed:`, error);
        
        if (error.response && error.data) {
          handleApiError(error.response, error.data);
        } else {
          handleNetworkError(error, retryCount, SECURITY_CONFIG.api.maxRetries);
        }
        
        if (retryCount < SECURITY_CONFIG.api.maxRetries) {
          setRetryCount(prev => prev + 1);
        }
      }
    },
    [validateFormData, reset, router, retryCount]
  );

  const handleGoogleAuth = useCallback(
    async (authResult: any) => {
      const requestId = generateRequestId();
      requestIdRef.current = requestId;
      
      console.log(`🔍 [${requestId}] Google Auth initiated`);
      setIsGoogleLoading(true);
      setGooglePopupClosed(false);

      try {
        // Validate auth result
        if (!authResult?.code) {
          throw new Error('Google authentication code is missing');
        }
        
        const result = await signUpWithGoogle(authResult.code);
        console.log(`✅ [${requestId}] Google signup successful`);
        
        // Extend session on successful signup
        sessionSecurity.extendSession();
        
        handleAuthSuccess(
          result.data?.token || result.token,
          result.data?.user || result.user,
          router
        );
        setRetryCount(0);
      } catch (error: any) {
        console.error(`❌ [${requestId}] Google signup failed:`, error);
        
        if (error.response && error.data) {
          handleGoogleApiError(error.response, error.data);
        } else {
          handleNetworkError(error, retryCount, SECURITY_CONFIG.api.maxRetries);
        }
        
        if (retryCount < SECURITY_CONFIG.api.maxRetries) {
          setRetryCount(prev => prev + 1);
        }
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [router, retryCount]
  );

  const handleGoogleAuthError = useCallback((error: any) => {
    const requestId = requestIdRef.current || generateRequestId();
    console.error(`🚨 [${requestId}] Google Auth Error:`, error);
    
    if (error?.error === 'popup_closed_by_user') {
      toast.error('Google sign-up was cancelled.');
    } else if (error?.error === 'access_denied') {
      toast.error('Google access denied. Please grant necessary permissions.');
    } else {
      toast.error('Google authentication failed. Please try again.');
    }
    
    setIsGoogleLoading(false);
    setGooglePopupClosed(true);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: handleGoogleAuthError,
    flow: "auth-code",
    ux_mode: 'popup',
    select_account: true,
  });

  const handleGoogleSignup = useCallback(() => {
    const requestId = generateRequestId();
    requestIdRef.current = requestId;
    
    console.log(`🔍 [${requestId}] Google signup initiated`);
    setIsGoogleLoading(true);
    setGooglePopupClosed(false);
    clearErrors();

    try {
      const checkPopupClosed = () => {
        popupCheckInterval.current = setTimeout(() => {
          if (isGoogleLoading) {
            console.log(`🔍 [${requestId}] Google popup timeout`);
            setGooglePopupClosed(true);
            setIsGoogleLoading(false);
          }
        }, SECURITY_CONFIG.api.timeout);
      };

      checkPopupClosed();
      googleLogin();
    } catch (error) {
      console.error(`🚨 [${requestId}] Error initiating Google signup:`, error);
      setIsGoogleLoading(false);
      setGooglePopupClosed(true);
      toast.error("Failed to initiate Google signup. Please try again.");
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

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `signup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}