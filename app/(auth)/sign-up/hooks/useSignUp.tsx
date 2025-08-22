"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signUpSchema, SignUpFormData } from "@/app/schemas/signupSchema";
import { useAuth } from "./useAuth";
import { useGoogleAuth } from "./useGoogleAuth";
import { sendOTP, verifyOTPForSignup } from "../services/otpApi";

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
  const [verificationToken, setVerificationToken] = useState<string>('');

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

  // Step 1: Send OTP when form is submitted
  const onSubmit = useCallback(async (data: SignUpFormData) => {
    if (isRateLimited || isGoogleRateLimited) {
      return;
    }

    try {
      console.log("📧 Sending OTP to:", data.email);
      
      await sendOTP(data.email);
      
      // Store form data for later use
      setUserData(data);
      setUserEmail(data.email);
      setCurrentStep(SignUpStep.OTP_VERIFICATION);
      
      toast.success(`✅ OTP sent to ${data.email}`);
      console.log("✅ OTP sent successfully, moved to verification step");
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
      // Stay on form step if OTP sending fails
    }
  }, [isRateLimited, isGoogleRateLimited]);

  // Step 2: Verify OTP, then Step 3: Create account
  const handleOTPVerificationSuccess = useCallback(async (otp: string) => {
    if (!userData || !userEmail) {
      toast.error("Session expired. Please start over.");
      setCurrentStep(SignUpStep.FORM);
      return;
    }

    try {
      console.log("🔍 Verifying OTP for email:", userEmail);
      
      // First: Verify OTP
      const verifyResult = await verifyOTPForSignup(userEmail, otp);
      console.log("✅ OTP verified successfully");
      
      // Store verification token if provided
      if (verifyResult.verificationToken) {
        setVerificationToken(verifyResult.verificationToken);
      }
      
      toast.success("✅ OTP verified! Creating your account...");

      // Second: Create user account with verification proof
      console.log("🔐 Creating user account...");
      const success = await signUpUser(userData, verifyResult.verificationToken);
      
      if (success) {
        setCurrentStep(SignUpStep.COMPLETE);
        console.log("✅ Account created successfully");
        
        // Navigate after successful account creation
        setTimeout(() => {
          router.push("/update");
        }, 1000);
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error) {
      console.error('OTP verification or signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP or create account';
      toast.error(errorMessage);
      
      // Don't go back to form immediately, let user try OTP again
      // Only go back to form if it's a session/data issue
      if (errorMessage.includes("Session expired") || errorMessage.includes("start over")) {
        setCurrentStep(SignUpStep.FORM);
        setUserData(null);
        setUserEmail('');
        setVerificationToken('');
      }
    }
  }, [userData, userEmail, signUpUser, router]);

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
    setVerificationToken('');
  }, []);

  // Resend OTP function
  const resendOTP = useCallback(async () => {
    if (!userEmail) {
      toast.error("No email found. Please start over.");
      goBackToForm();
      return;
    }

    try {
      console.log("📧 Resending OTP to:", userEmail);
      await sendOTP(userEmail);
      toast.success(`✅ OTP resent to ${userEmail}`);
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to resend OTP');
    }
  }, [userEmail, goBackToForm]);

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