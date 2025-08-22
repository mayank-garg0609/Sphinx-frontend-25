"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signUpSchema, SignUpFormData } from "@/app/schemas/signupSchema";
import { useGoogleAuth } from "./useGoogleAuth";
import { sendOTP, verifyOTPForSignup } from "../services/otpApi";
import { handleAuthSuccess } from "@/app/(auth)/sign-up/utils/authHelpers";

export enum SignUpStep {
  FORM = 'form',
  OTP_VERIFICATION = 'otp_verification',
  COMPLETE = 'complete'
}

interface UseSignUpWithOTPReturn {
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
  handleOTPVerificationSuccess: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  
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
  const [userData, setUserData] = useState<SignUpFormData | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

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

  const { 
    isGoogleLoading, 
    googlePopupClosed, 
    handleGoogleSignup, 
    isRateLimited: isGoogleRateLimited,
    error: googleError 
  } = useGoogleAuth(router, clearErrors);

  // Step 1: Send OTP when form is submitted
  const onSubmit = useCallback(async (data: SignUpFormData) => {
    if (isRateLimited || isGoogleRateLimited) {
      toast.error("Please wait before trying again.");
      return;
    }

    // Client-side validation
    if (!data.name?.trim()) {
      toast.error("Name is required.");
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

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!data.agreed) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsPending(true);

    try {
      console.log("📧 Sending OTP to:", data.email);
      
      // Call the updated sendOTP function
      await sendOTP(data.email);
      
      // Store form data for later use in verification step
      setUserData(data);
      setUserEmail(data.email);
      setCurrentStep(SignUpStep.OTP_VERIFICATION);
      
      toast.success(`✅ OTP sent to ${data.email}`);
      console.log("✅ OTP sent successfully, moved to verification step");
      setRetryCount(0);
    } catch (error) {
      console.error('Send OTP error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (errorMessage.includes("already exists")) {
        // Don't move to OTP step if user already exists
        return;
      }
      
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsPending(false);
    }
  }, [isRateLimited, isGoogleRateLimited, retryCount]);

  // Step 2: Verify OTP and create user account
  const handleOTPVerificationSuccess = useCallback(async (otp: string) => {
    if (!userData || !userEmail) {
      toast.error("Session expired. Please start over.");
      setCurrentStep(SignUpStep.FORM);
      return;
    }

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsPending(true);

    try {
      console.log("🔍 Verifying OTP and creating user for email:", userEmail);
      
      // Call the updated verifyOTPForSignup function with new API
      const result = await verifyOTPForSignup(
        userData.name,
        userEmail,
        otp,
        userData.password
      );
      
      console.log("✅ OTP verified and user created successfully");
      toast.success("✅ Account created successfully!");

      // Handle authentication success - user is now fully verified and created
      await handleAuthSuccess(
        result.accessToken,
        result.refreshToken,
        result.expiresIn,
        result.user,
        router
      );

      setCurrentStep(SignUpStep.COMPLETE);
      
      // Navigate after successful account creation
      setTimeout(() => {
        router.push("/update");
      }, 1500);
      
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (errorMessage.includes("already exist") || errorMessage.includes("already exists")) {
        toast.error("An account with this email already exists. Please log in instead.");
        setCurrentStep(SignUpStep.FORM);
        setUserData(null);
        setUserEmail('');
        return;
      }
      
      if (errorMessage.includes("Invalid or expired")) {
        toast.error("Invalid or expired OTP. Please try again or request a new OTP.");
        // Stay on OTP step to allow retry
        return;
      }
      
      // For other errors, allow retry on OTP step
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsPending(false);
    }
  }, [userData, userEmail, router, retryCount]);

  const goToOTPVerification = useCallback(() => {
    const email = getValues('email');
    if (email) {
      setUserEmail(email);
      setCurrentStep(SignUpStep.OTP_VERIFICATION);
    }
  }, [getValues]);

  const goBackToForm = useCallback(() => {
    setCurrentStep(SignUpStep.FORM);
    setUserData(null);
    setUserEmail('');
    setRetryCount(0);
  }, []);

  // Resend OTP function
  const resendOTP = useCallback(async () => {
    if (!userEmail) {
      toast.error("No email found. Please start over.");
      goBackToForm();
      return;
    }

    setIsPending(true);

    try {
      console.log("📧 Resending OTP to:", userEmail);
      await sendOTP(userEmail);
      toast.success(`✅ OTP resent to ${userEmail}`);
      setRetryCount(0);
    } catch (error) {
      console.error('Resend OTP error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';
      toast.error(errorMessage);
      
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsPending(false);
    }
  }, [userEmail, goBackToForm, retryCount]);

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
    resendOTP,
    isGoogleLoading,
    googlePopupClosed,
    retryCount,
    isPending,
    isRateLimited,
    isGoogleRateLimited,
    googleError,
  };
};