"use client";

import { useState, useCallback, memo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import logo from "@/public/image/logo.webp";
import ascended from "@/public/image/ascended.webp";
import { loginSchema, LoginFormData } from "../../schemas/loginSchema";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";

const FORM_FIELDS = {
  email: {
    id: "email",
    type: "email" as const,
    placeholder: "example@email.com",
    label: "Email Address",
  },
  password: {
    id: "password",
    type: "password" as const,
    placeholder: "Enter your password",
    label: "Password",
  },
} as const;

const BUTTON_STYLES = {
  primary:
    "w-full bg-white text-black font-semibold py-2 lg:py-2 py-3 rounded-lg hover:bg-gray-200 transition text-sm lg:text-base",
  secondary:
    "w-full flex items-center justify-center border border-white text-white font-medium py-2 lg:py-2 py-3 rounded-lg hover:bg-white hover:text-black transition text-sm lg:text-base gap-2",
} as const;

const FORM_CONTAINER_STYLES = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: "#cbd5e1 #2d2d2d",
} as const;

const MOBILE_STYLES = {
  container:
    "min-h-screen w-full flex bg-black bg-cover bg-center bg-no-repeat px-4 lg:px-4 px-6",
  backgroundImage: {
    desktop:
      "h-[840px] w-auto object-contain justify-start absolute bottom-0 left-48 hidden lg:block",
    mobile: "absolute inset-0 w-full h-full object-cover lg:hidden",
  },
  form: "bg-black/40 backdrop-blur-md text-white p-6 lg:p-8 rounded-2xl lg:rounded-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] w-full max-w-sm lg:max-w-md border border-white/30 space-y-4 lg:space-y-6 font-main lg:mr-36 mx-auto h-auto lg:h-[70vh] max-h-[85vh] overflow-y-auto",
  formWrapper:
    "relative z-10 flex justify-center lg:justify-end w-full items-center min-h-screen py-8 lg:py-0",
} as const;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface LoginResponse extends ApiResponse{
  token: string;
  user: {
    sphinx_id: string;
    name: string;
    email: string;
    role: string;
    is_verified: boolean;
    applied_ca: boolean;
  };
}

const saveAuthToken = (token: string): void => {
  try {
    localStorage.setItem("auth_token", token);
  } catch (error) {
    console.error("Failed to save auth token:", error);
  }
};

const saveUserData = (user: any): void => {
  try {
    localStorage.setItem("user_data", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save user data:", error);
  }
};

const calculatePasswordStrength = (
  password: string
): "Weak" | "Medium" | "Strong" | "" => {
  if (!password) return "";

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (password.length < 8) {
    return "Weak";
  } else if (hasUpper && hasLower && hasNumber && hasSpecial) {
    return "Strong";
  } else {
    return "Medium";
  }
};

const handleAuthSuccess = (token: string, user: any, router: any): void => {
  try {
    saveAuthToken(token);
    saveUserData(user);
    toast.success("✅ Logged in successfully!");
    router.push("/", { onTransitioReady: slideInOut });
  } catch (error) {
    console.error("Auth success handling failed:", error);
    toast.error(
      "Login successful but navigation failed. Please refresh the page."
    );
  }
};

const handleApiError = (res: Response, result: any): void => {
  console.error("❌ Server error:", result);

  switch (res.status) {
    case 404:
      toast.error("User not found. Please check your email or sign up.");
      break;
    case 400:
      if (result.error?.includes("Google")) {
        toast.error(
          "You signed up using Google. Please log in with Google Auth."
        );
      } else {
        toast.error(result.error || "Invalid credentials. Please try again.");
      }
      break;
    case 401:
      toast.error("Invalid password. Please try again.");
      break;
    case 500:
      toast.error("Server error. Please try again later.");
      break;
    default:
      toast.error(result.error || "Login failed. Please try again.");
  }
};

const handleGoogleApiError = (res: Response, result: any): void => {
  console.error("❌ Google login failed:", result);

  switch (res.status) {
    case 400:
      toast.error("Invalid Google authentication code. Please try again.");
      break;
    case 500:
      toast.error("Failed to authenticate with Google. Please try again.");
      break;
    default:
      toast.error(
        result.error || "Google authentication failed. Please try again."
      );
  }
};

const PasswordValidationMessage = memo(function PasswordValidationMessage({
  password,
  error,
}: {
  password: string;
  error?: string;
}) {
  if (error) {
    return <span className="text-red-400 text-xs lg:text-sm">{error}</span>;
  }

  if (!password) return null;

  const strength = calculatePasswordStrength(password);
  const isShort = password.length < 8;

  const colorClass = isShort
    ? "text-red-400"
    : strength === "Strong"
    ? "text-green-400"
    : strength === "Medium"
    ? "text-yellow-400"
    : "text-red-400";

  const message = isShort
    ? "Password is too short."
    : `Password Strength: ${strength}`;

  return <span className={`${colorClass} text-xs lg:text-sm`}>{message}</span>;
});

const FormField = memo(function FormField({
  field,
  register,
  error,
  children,
}: {
  field: typeof FORM_FIELDS.email | typeof FORM_FIELDS.password;
  register: any;
  error?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col text-zinc-300 gap-2">
      <Label htmlFor={field.id} className="text-sm lg:text-base font-medium">
        {field.label}
      </Label>
      <Input
        id={field.id}
        type={field.type}
        placeholder={field.placeholder}
        {...register(field.id)}
        className="text-sm lg:text-base py-2 lg:py-2 h-10 lg:h-auto"
      />
      <span className="text-xs lg:text-sm h-1 block">
        {error ? (
          <span className="text-red-400 text-xs lg:text-sm">{error}</span>
        ) : (
          children
        )}
      </span>
    </div>
  );
});

const LoginHeader = memo(function LoginHeader() {
  return (
    <div className="flex flex-col gap-2 lg:gap-2">
      <div className="flex items-center gap-3 justify-center">
        <Image
          className="w-5 h-5 lg:w-6 lg:h-6 bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          src={logo}
          alt="Sphinx Logo"
          placeholder="blur"
          blurDataURL={logo.blurDataURL}
          priority
        />
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-wide">
          Sphinx'25
        </h1>
      </div>

      <div className="text-center pt-4 lg:pt-6 flex flex-col space-y-1 lg:space-y-2">
        <h2 className="text-xl lg:text-2xl font-bold text-white">
          Welcome Back
        </h2>
        <p className="text-xs lg:text-sm text-zinc-400">
          Log in to your account
        </p>
      </div>
    </div>
  );
});

const BackgroundImage = memo(function BackgroundImage() {
  return (
    <>
      <Image
        src={ascended}
        alt="ascended human image"
        placeholder="blur"
        blurDataURL={ascended.blurDataURL}
        className={MOBILE_STYLES.backgroundImage.desktop}
        priority
      />

      <Image
        src={ascended}
        alt="ascended human image"
        placeholder="blur"
        blurDataURL={ascended.blurDataURL}
        className={MOBILE_STYLES.backgroundImage.mobile}
        priority
        fill
      />
    </>
  );
});

const ActionButtons = memo(function ActionButtons({
  isSubmitting,
  onGoogleLogin,
  isGoogleLoading,
}: {
  isSubmitting: boolean;
  onGoogleLogin: () => void;
  isGoogleLoading: boolean;
}) {
  return (
    <div className="space-y-3 lg:space-y-3">
      <button
        type="submit"
        disabled={isSubmitting}
        className={BUTTON_STYLES.primary}
      >
        {isSubmitting ? "Logging In..." : "Log In"}
      </button>

      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={isGoogleLoading}
        className={BUTTON_STYLES.secondary}
      >
        <FcGoogle className="w-4 h-4 lg:w-5 lg:h-5" />
        <span>
          {isGoogleLoading ? "Authenticating..." : "Continue with Google"}
        </span>
      </button>
    </div>
  );
});

const SignUpLink = memo(function SignUpLink() {
  const router = useTransitionRouter();

  const handleSignUpClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      router.push("/sign-up", { onTransitionReady: slideInOut });
    },
    [router]
  );

  return (
    <div className="text-center text-xs lg:text-sm text-zinc-400 mt-2 lg:mt-2">
      Don't have an account?{" "}
      <Link
        href="/sign-up"
        onClick={handleSignUpClick}
        className="text-blue-400 hover:underline font-medium"
      >
        Sign Up
      </Link>
    </div>
  );
});


export default function LoginPage() {
  const router = useTransitionRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const password = watch("password");

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      console.log("🔐 Logging in with:", data);

      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result: LoginResponse = await res.json();


        if (res.ok) {
          console.log("✅ Login successful:", result);
          handleAuthSuccess(result.token, result.user, router);
          reset();
        } else {
          handleApiError(res, result);
        }
      } catch (err) {
        console.error("🚨 Network error:", err);
        toast.error(
          "Network error. Please check your connection and try again."
        );
      }
    },
    [reset, router]
  );

  const handleGoogleAuth = useCallback(
    async (authResult: any) => {
      console.log("🔍 Google Auth initiated with code:", authResult.code);
      setIsGoogleLoading(true);

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

        const result: LoginResponse = await res.json();

        if (res.ok) {
          console.log("✅ Google login successful:", result);
          handleAuthSuccess(result.token, result.user, router);
        } else {
          handleGoogleApiError(res, result);
        }
      } catch (err) {
        console.error("🚨 Google Auth error:", err);
        toast.error("Google authentication failed. Please try again.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [router]
  );

  const handleGoogleAuthError = useCallback((error: any) => {
    console.error("🚨 Google Auth Error:", error);
    toast.error(
      "Google authentication was cancelled or failed. Please try again."
    );
    setIsGoogleLoading(false);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: handleGoogleAuthError,
    flow: "auth-code",
  });

  const handleGoogleLogin = useCallback(() => {
    console.log("🔍 Google login clicked");
    setIsGoogleLoading(true);
    googleLogin();
  }, [googleLogin]);

  const emailError = errors.email?.message?.toString();
  const passwordError = errors.password?.message?.toString();

  return (
    <div className={MOBILE_STYLES.container}>
      <BackgroundImage />

      <div className={MOBILE_STYLES.formWrapper}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={MOBILE_STYLES.form}
          style={FORM_CONTAINER_STYLES}
        >
          <LoginHeader />

          <div className="space-y-4 lg:space-y-6 pt-4 lg:pt-6 pb-4 lg:pb-6">
            <FormField
              field={FORM_FIELDS.email}
              register={register}
              error={emailError}
            />

            <FormField
              field={FORM_FIELDS.password}
              register={register}
              error={passwordError}
            >
              <PasswordValidationMessage
                password={password || ""}
                error={passwordError}
              />
            </FormField>
          </div>

          <ActionButtons
            isSubmitting={isSubmitting}
            onGoogleLogin={handleGoogleLogin}
            isGoogleLoading={isGoogleLoading}
          />

          <SignUpLink />
        </form>
      </div>
    </div>
  );
}
