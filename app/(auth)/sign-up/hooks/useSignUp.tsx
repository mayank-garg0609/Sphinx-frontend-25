// app/(auth)/sign-up/hooks/useSignUpWithOTP.tsx
"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "@/app/schemas/signupSchema";
import { useAuth } from "./useAuth";
import { useGoogleAuth } from "./useGoogleAuth";

export enum SignUpStep {
  FORM = 'form',
  OTP_VERIFICATION = 'otp_verification',
  COMPLETE = 'complete'
}

interface UseSignUpWithOTPReturn {
  // Form methods
  register: any;
  handleSubmit: any;
  watch: any;
  errors: any;
  isSubmitting: boolean;
  clearErrors: () => void;
  
  // Auth methods
  onSubmit: (data: SignUpFormData) => Promise<void>;
  handleGoogleSignup: () => void;
  
  // OTP flow
  currentStep: SignUpStep;
  userEmail: string;
  goToOTPVerification: () => void;
  goBackToForm: () => void;
  handleOTPVerificationSuccess: () => void;
  
  // Loading states
  isGoogleLoading: boolean;
  googlePopupClosed: boolean;
  retryCount: number;
  isPending: boolean;
  isRateLimited: boolean;
  isGoogleRateLimited: boolean;
  googleError: string | null;
}

export const useSignUpWithOTP = (router: any): UseSignUpWithOTPReturn => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>(SignUpStep.FORM);
  const [userEmail, setUserEmail] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
    getValues,
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
      // After successful signup, store email and move to OTP verification
      setUserEmail(data.email);
      setCurrentStep(SignUpStep.OTP_VERIFICATION);
    } catch (error) {
      console.error('Form submission error:', error);
      // Stay on form step if signup fails
    }
  }, [signUpUser, isRateLimited, isGoogleRateLimited]);

  const goToOTPVerification = useCallback(() => {
    const email = getValues('email');
    if (email) {
      setUserEmail(email);
      setCurrentStep(SignUpStep.OTP_VERIFICATION);
    }
  }, [getValues]);

  const goBackToForm = useCallback(() => {
    setCurrentStep(SignUpStep.FORM);
  }, []);

  const handleOTPVerificationSuccess = useCallback(() => {
    setCurrentStep(SignUpStep.COMPLETE);
    // Navigate to the next page after successful OTP verification
    setTimeout(() => {
      router.push("/update");
    }, 1000);
  }, [router]);

  return {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting: isSubmitting || isPending,
    clearErrors,
    onSubmit,
    handleGoogleSignup,
    currentStep,
    userEmail,
    goToOTPVerification,
    goBackToForm,
    handleOTPVerificationSuccess,
    isGoogleLoading,
    googlePopupClosed,
    retryCount,
    isPending,
    isRateLimited,
    isGoogleRateLimited,
    googleError,
  };
};