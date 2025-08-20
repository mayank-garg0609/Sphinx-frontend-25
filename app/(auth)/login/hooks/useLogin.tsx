"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/app/schemas/loginSchema";
import { useUser } from "@/app/hooks/useUser/useUser";

interface UseLoginReturn {
  register: any;
  handleSubmit: any;
  watch: any;
  errors: any;

  onSubmit: (data: LoginFormData) => Promise<void>;
  onGoogleLogin: (code: string) => Promise<void>;

  isSubmitting: boolean;
  isGoogleLoading: boolean;

  loginError: string | null;
  googleError: string | null;

  retryCount: number;
  isRateLimited: boolean;

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
    isRateLimited,
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

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        await auth.loginWithCredentials(data);
        reset(); // Clear form on success
      } catch (error) {
        console.error("Login submission error:", error);
      }
    },
    [auth, reset]
  );

  const onGoogleLogin = useCallback(
    async (code: string) => {
      try {
        await auth.loginWithGoogle(code);
      } catch (error) {
        console.error("Google login error:", error);
      }
    },
    [auth]
  );

  const clearErrors = useCallback(() => {
    clearFormErrors();
  }, [clearFormErrors]);

  return {
    register,
    handleSubmit,
    watch,
    errors,
    onSubmit,
    onGoogleLogin,
    isSubmitting: isSubmitting || loginLoading,
    isGoogleLoading: googleLoading,

    loginError,
    googleError,

    retryCount: loginRetryCount,
    isRateLimited,

    clearErrors,
  };
};
