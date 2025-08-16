"use client";

import { useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "@/app/schemas/signupSchema";
import { useAuth } from "./useAuth";
import { useGoogleAuth } from "./useGoogleAuth";

interface UseSignUpReturn {
  register: any;
  handleSubmit: any;
  watch: any;
  errors: any;
  isSubmitting: boolean;
  onSubmit: (data: SignUpFormData) => Promise<void>;
  handleGoogleSignup: () => void;
  isGoogleLoading: boolean;
  googlePopupClosed: boolean;
  retryCount: number;
  isPending: boolean;
  isRateLimited: boolean;
  isGoogleRateLimited: boolean;
  googleError: string | null;
  clearErrors: () => void;
}

export const useSignUp = (router: any): UseSignUpReturn => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
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

  const { signUpUser, retryCount, isPending, isRateLimited } = useAuth(router, reset);
  const { 
    isGoogleLoading, 
    googlePopupClosed, 
    handleGoogleSignup, 
    isRateLimited: isGoogleRateLimited,
    error: googleError 
  } = useGoogleAuth(router, clearErrors);

  const onSubmit = useCallback(async (data: SignUpFormData) => {
    if (isRateLimited || isGoogleRateLimited) {
      return;
    }

    try {
      await signUpUser(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [signUpUser, isRateLimited, isGoogleRateLimited]);

  return {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting: isSubmitting || isPending,
    onSubmit,
    handleGoogleSignup,
    isGoogleLoading,
    googlePopupClosed,
    retryCount,
    isPending,
    isRateLimited,
    isGoogleRateLimited,
    googleError,
    clearErrors,
  };
};