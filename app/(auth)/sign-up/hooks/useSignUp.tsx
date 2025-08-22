"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "@/app/schemas/signupSchema";
import { useUser } from "@/app/hooks/useUser/useUser";

interface UseSignUpReturn {
  // Form methods
  register: any;
  handleSubmit: any;
  watch: any;
  errors: any;
  
  // Auth methods and state
  onSubmit: (data: SignUpFormData) => Promise<void>;
  onGoogleSignUp: (code: string) => Promise<void>;
  
  // Loading states
  isSubmitting: boolean;
  isGoogleLoading: boolean;
  
  // Error states
  signupError: string | null;
  googleError: string | null;
  
  // Other states
  retryCount: number;
  isRateLimited: boolean;
  
  // Utility
  clearErrors: () => void;
}

export const useSignUp = (): UseSignUpReturn => {
  const {
    auth,
    signupLoading,
    googleLoading,
    signupError,
    googleError,
    signupRetryCount,
    isRateLimited
  } = useUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    clearErrors: clearFormErrors,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreed: false,
    },
  });

  const onSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      await auth.signUpWithCredentials(data);
      reset(); // Clear form on success
    } catch (error) {
      console.error('Signup submission error:', error);
    }
  }, [auth, reset]);

  const onGoogleSignUp = useCallback(async (code: string) => {
    try {
      await auth.signUpWithGoogle(code);
    } catch (error) {
      console.error('Google signup error:', error);
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
    onGoogleSignUp,
    
    // Loading states
    isSubmitting: isSubmitting || signupLoading,
    isGoogleLoading: googleLoading,
    
    // Error states
    signupError,
    googleError,
    
    // Other states
    retryCount: signupRetryCount,
    isRateLimited,
    
    // Utility
    clearErrors,
  };
};