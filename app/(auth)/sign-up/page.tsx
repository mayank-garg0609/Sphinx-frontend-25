"use client";

import { useState, useMemo, useCallback, memo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "../../schemas/signupSchema";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import logo from "@/public/image/logo.webp";
import ascended from "@/public/image/ascended.webp";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";

const FORM_FIELDS = {
  name: {
    id: "name" as const,
    type: "text" as const,
    placeholder: "John Doe",
    label: "Full Name",
  },
  email: {
    id: "email" as const,
    type: "email" as const,
    placeholder: "example@email.com",
    label: "Email Address",
  },
  password: {
    id: "password" as const,
    type: "password" as const,
    placeholder: "Enter a secure password",
    label: "Password",
  },
  confirmPassword: {
    id: "confirmPassword" as const,
    type: "password" as const,
    placeholder: "Re-enter password",
    label: "Confirm Password",
  },
} as const;

const BUTTON_STYLES = {
  primary:
    "w-full bg-white text-black font-semibold py-2 lg:py-2 py-3 rounded-lg hover:bg-gray-200 transition text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed",
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
  form: "bg-black/40 backdrop-blur-md text-white p-6 lg:p-8 rounded-2xl lg:rounded-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] w-full max-w-sm lg:max-w-md border border-white/30 space-y-4 lg:space-y-6 font-main lg:mr-36 mx-auto h-auto lg:h-[75vh] max-h-[90vh] overflow-y-auto",
  formWrapper:
    "relative z-10 flex justify-center lg:justify-end w-full items-center min-h-screen py-6 lg:py-0",
} as const;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface SignUpResponse {
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
    toast.success("✅ Account created successfully!");
    router.push("/", { onTransitionReady: slideInOut });
  } catch (error) {
    console.error("Auth success handling failed:", error);
    toast.error(
      "Account created but navigation failed. Please refresh the page."
    );
  }
};

const handleApiError = (res: Response, result: any): void => {
  console.error("❌ Server error:", result);

  switch (res.status) {
    case 409:
      toast.error("Account already exists. Please try logging in instead.");
      break;
    case 400:
      if (result.error?.includes("email")) {
        toast.error("Invalid email address. Please check and try again.");
      } else if (result.error?.includes("password")) {
        toast.error("Password doesn't meet requirements. Please try again.");
      } else {
        toast.error(result.error || "Invalid input. Please check your details.");
      }
      break;
    case 500:
      toast.error("Server error. Please try again later.");
      break;
    default:
      toast.error(result.error || "Sign up failed. Please try again.");
  }
};

const handleGoogleApiError = (res: Response, result: any): void => {
  console.error("❌ Google signup failed:", result);

  switch (res.status) {
    case 400:
      toast.error("Invalid Google authentication code. Please try again.");
      break;
    case 409:
      toast.error("Account already exists. Please try logging in instead.");
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
  field: (typeof FORM_FIELDS)[keyof typeof FORM_FIELDS];
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

const SignUpHeader = memo(function SignUpHeader() {
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

      <div className="text-center pt-3 lg:pt-6 flex flex-col space-y-1 lg:space-y-2">
        <h2 className="text-xl lg:text-2xl font-bold text-white">
          Create Your Account
        </h2>
        <p className="text-xs lg:text-sm text-zinc-400">
          Join us for an amazing experience
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
  onGoogleSignup,
  isGoogleLoading,
}: {
  isSubmitting: boolean;
  onGoogleSignup: () => void;
  isGoogleLoading: boolean;
}) {
  return (
    <div className="space-y-3 lg:space-y-3">
      <button
        type="submit"
        disabled={isSubmitting}
        className={BUTTON_STYLES.primary}
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>

      <button
        type="button"
        onClick={onGoogleSignup}
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

const TermsCheckbox = memo(function TermsCheckbox({
  register,
  error,
}: {
  register: any;
  error?: string;
}) {
  const termsLink = useMemo(
    () => (
      <Link
        href="/terms-and-conditions"
        className="text-blue-400 hover:underline font-medium"
      >
        Terms and Conditions
      </Link>
    ),
    []
  );

  return (
    <div className="space-y-1">
      <div className="flex items-start text-xs lg:text-sm gap-2 text-zinc-300">
        <input
          type="checkbox"
          id="agreed"
          {...register("agreed")}
          className="mt-1 accent-white scale-110 lg:scale-100"
        />
        <label htmlFor="agreed" className="leading-tight">
          I agree to the {termsLink}
        </label>
      </div>
      {error && (
        <span className="text-red-400 text-xs lg:text-sm block">{error}</span>
      )}
    </div>
  );
});

const LoginLink = memo(function LoginLink() {
  const router = useTransitionRouter();

  const handleLoginClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      router.push("/login", { onTransitionReady: slideInOut });
    },
    [router]
  );

  return (
    <div className="text-center text-xs lg:text-sm text-zinc-400 mt-2 lg:mt-2">
      Already have an account?{" "}
      <Link
        href="/login"
        onClick={handleLoginClick}
        className="text-blue-400 hover:underline font-medium"
      >
        Log In
      </Link>
    </div>
  );
});

export default function SignUpPage() {
  const router = useTransitionRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch("password");

  const submitHandlerRef = useRef<(data: SignUpFormData) => Promise<void>>();
  const googleAuthHandlerRef = useRef<(authResult: any) => Promise<void>>();
  const googleErrorHandlerRef = useRef<(error: any) => void>();

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      console.log("📦 Signing up with:", data);

      try {
        const res = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("❌ Server returned non-JSON response:", res.status);
          toast.error("Server configuration error. Please try again later.");
          return;
        }

        const result: ApiResponse<SignUpResponse> = await res.json();

        if (res.ok) {
          console.log("✅ Sign up successful:", result);
          handleAuthSuccess(result.data?.token || result.token, result.data?.user || result.user, router);
          reset();
        } else {
          handleApiError(res, result);
        }
      } catch (err) {
        console.error("🚨 Network error:", err);
        if (err instanceof SyntaxError && err.message.includes("Unexpected token")) {
          toast.error("Server returned invalid response. Please check if the API endpoint exists.");
        } else {
          toast.error("Network error. Please check your connection and try again.");
        }
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

        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("❌ Server returned non-JSON response:", res.status);
          toast.error("Server configuration error. Please try again later.");
          return;
        }

        const result = await res.json();

        if (res.ok) {
          console.log("✅ Google signup successful:", result);
          handleAuthSuccess(result.data?.token || result.token, result.data?.user || result.user, router);
        } else {
          handleGoogleApiError(res, result);
        }
      } catch (err) {
        console.error("🚨 Google Auth error:", err);
        if (err instanceof SyntaxError && err.message.includes("Unexpected token")) {
          toast.error("Server returned invalid response. Please check if the Google auth endpoint exists.");
        } else {
          toast.error("Google authentication failed. Please try again.");
        }
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

  submitHandlerRef.current = onSubmit;
  googleAuthHandlerRef.current = handleGoogleAuth;
  googleErrorHandlerRef.current = handleGoogleAuthError;

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: handleGoogleAuthError,
    flow: "auth-code",
  });

  const handleGoogleSignup = useCallback(() => {
    console.log("🔍 Google signup clicked");
    setIsGoogleLoading(true);
    googleLogin();
  }, [googleLogin]);

  const errorMessages = useMemo(
    () => ({
      name: errors.name?.message?.toString(),
      email: errors.email?.message?.toString(),
      password: errors.password?.message?.toString(),
      confirmPassword: errors.confirmPassword?.message?.toString(),
      agreed: errors.agreed?.message?.toString(),
    }),
    [errors]
  );

  return (
    <div className={MOBILE_STYLES.container}>
      <BackgroundImage />

      <div className={MOBILE_STYLES.formWrapper}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={MOBILE_STYLES.form}
          style={FORM_CONTAINER_STYLES}
        >
          <SignUpHeader />

          <div className="space-y-4 lg:space-y-6 pt-3 lg:pt-6 pb-3 lg:pb-6">
            <FormField
              field={FORM_FIELDS.name}
              register={register}
              error={errorMessages.name}
            />

            <FormField
              field={FORM_FIELDS.email}
              register={register}
              error={errorMessages.email}
            />

            <FormField
              field={FORM_FIELDS.password}
              register={register}
              error={errorMessages.password}
            >
              <PasswordValidationMessage
                password={password || ""}
                error={errorMessages.password}
              />
            </FormField>

            <FormField
              field={FORM_FIELDS.confirmPassword}
              register={register}
              error={errorMessages.confirmPassword}
            />

            <TermsCheckbox register={register} error={errorMessages.agreed} />
          </div>

          <ActionButtons
            isSubmitting={isSubmitting}
            onGoogleSignup={handleGoogleSignup}
            isGoogleLoading={isGoogleLoading}
          />

          <LoginLink />
        </form>
      </div>
    </div>
  );
}