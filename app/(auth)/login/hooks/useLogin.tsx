"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/app/schemas/loginSchema";
import { useUser } from "@/app/hooks/useUser/useUser";

interface UseLoginReturn {
  // Form methods
  register: any;
  handleSubmit: any;
  watch: any;
  errors: any;
  
  // Auth methods and state
  onSubmit: (data: LoginFormData) => Promise<void>;
  onGoogleLogin: (code: string) => Promise<void>;
  
  // Loading states
  isSubmitting: boolean;
  isGoogleLoading: boolean;
  
  // Error states
  loginError: string | null;
  googleError: string | null;
  
  // Other states
  retryCount: number;
  isRateLimited: boolean;
  
  // Utility
  clearErrors: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const {
    auth,
    loginLoading,
    googleLoading,
    loginError,
    googleError,
    loginRetryCount,
    isRateLimited
  } = useUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    clearErrors: clearFormErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      await auth.loginWithCredentials(data);
      reset(); // Clear form on success
    } catch (error) {
      console.error('Login submission error:', error);
    }
  }, [auth, reset]);

  const onGoogleLogin = useCallback(async (code: string) => {
    try {
      await auth.loginWithGoogle(code);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }, [auth]);

  const clearErrors = useCallback(() => {
    clearFormErrors();
  }, [clearFormErrors]);

  return {
    // Form methods
    register,
    handleSubmit,
    watch,
    errors,
    
    // Auth methods
    onSubmit,
    onGoogleLogin,
    
    // Loading states
    isSubmitting: isSubmitting || loginLoading,
    isGoogleLoading: googleLoading,
    
    // Error states
    loginError,
    googleError,
    
    // Other states
    retryCount: loginRetryCount,
    isRateLimited,
    
    // Utility
    clearErrors,
  };
};