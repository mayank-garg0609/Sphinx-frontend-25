"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "../../schemas/signupSchema";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import logo from "@/public/image/logo.webp";
import ascended from "@/public/image/ascended.webp";


const calculatePasswordStrength = (password: string): "Weak" | "Medium" | "Strong" | "" => {
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


const PasswordValidationMessage = ({ password, error }: { password: string; error?: string }) => {
  const strengthData = useMemo(() => {
    const strength = calculatePasswordStrength(password);
    const isShort = password.length < 8;
    
    return {
      strength,
      isShort,
      colorClass: isShort 
        ? "text-red-400"
        : strength === "Strong"
        ? "text-green-400"
        : strength === "Medium"
        ? "text-yellow-400"
        : "text-red-400",
      message: isShort 
        ? "Password is too short."
        : `Password Strength: ${strength}`
    };
  }, [password]);

  if (error) {
    return <span className="text-red-400">{error}</span>;
  }

  if (!password) return null;

  return (
    <span className={strengthData.colorClass}>
      {strengthData.message}
    </span>
  );
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [passwordStrength, setPasswordStrength] = useState<
    "Weak" | "Medium" | "Strong" | ""
  >("");

  const password = watch("password");


  const onSubmit = useCallback(async (data: SignUpFormData) => {
    console.log("📦 Submitting to backend:", data);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("✅ Sign up successful:", result);
        reset();
        setPasswordStrength("");
        toast.success("✅ Account created successfully!");
      } else {
        const error = await res.json();
        console.error("❌ Server error:", error);
        toast.error(error.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("🚨 Network error:", err);
      toast.error("Network error. Please check your connection.");
    }
  }, [reset]);

  const handleGoogleSignup = useCallback(() => {
    // Implement Google OAuth logic here
    console.log("Google signup clicked");
  }, []);

  
  const formFields = useMemo(() => ({
    name: {
      id: "name",
      type: "text" as const,
      placeholder: "John Doe",
      label: "Full Name",
    },
    email: {
      id: "email",
      type: "email" as const,
      placeholder: "example@email.com",
      label: "Email Address",
    },
    password: {
      id: "password",
      type: "password" as const,
      placeholder: "Enter a secure password",
      label: "Password",
    },
    confirmPassword: {
      id: "confirmPassword",
      type: "password" as const,
      placeholder: "Re-enter password",
      label: "Confirm Password",
    }
  }), []);


  const buttonStyles = useMemo(() => ({
    primary: "w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition",
    secondary: "w-full flex items-center justify-center border border-white text-white font-medium py-2 rounded-lg hover:bg-white hover:text-black transition"
  }), []);

  
  const formContainerStyles = useMemo(() => ({
    scrollbarWidth: "thin" as const,
    scrollbarColor: "#cbd5e1 #2d2d2d"
  }), []);


  const termsLink = useMemo(() => (
    <Link
      href="/terms-and-conditions"
      className="text-blue-400 hover:underline"
    >
      Terms and Conditions
    </Link>
  ), []);


  const renderFieldError = useCallback((error?: string) => (
    <span className="text-sm h-1 block">
      {error && (
        <span className="text-red-400">
          {error}
        </span>
      )}
    </span>
  ), []);

  return (
    <div className="min-h-screen w-full flex bg-black bg-cover bg-center bg-no-repeat px-4">
      <Image
        src={ascended}
        alt="ascended human image"
        placeholder="blur"
        blurDataURL={ascended.blurDataURL}
        className="h-[840px] w-auto object-contain justify-start absolute bottom-0 left-48"
        priority
      />

      <div className="relative z-10 flex justify-end w-full items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-black/30 backdrop-blur-md text-white p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] w-full max-w-md border border-white/30 space-y-6 font-main mr-36 h-[70vh] overflow-y-auto"
          style={formContainerStyles}
        >
          <div className="flex flex-col gap-2">
           
            <div className="flex items-center gap-3 justify-center">
              <Image
                className="w-6 h-6 bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                src={logo}
                alt="Sphinx Logo"
                placeholder="blur"
                blurDataURL={logo.blurDataURL}
                priority
              />
              <h1 className="text-3xl font-bold text-white tracking-wide">
                Sphinx'25
              </h1>
            </div>

      
            <div className="text-center pt-6 flex flex-col space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Create Your Account
              </h2>
            </div>

         
            <div className="space-y-6 pt-6 pb-6">
              {/* Name */}
              <div className="flex flex-col text-zinc-300 gap-2">
                <Label htmlFor={formFields.name.id}>
                  {formFields.name.label}
                </Label>
                <Input
                  id={formFields.name.id}
                  type={formFields.name.type}
                  placeholder={formFields.name.placeholder}
                  {...register("name")}
                />
                {renderFieldError(errors.name?.message?.toString())}
              </div>

          
              <div className="flex flex-col text-zinc-300 gap-2">
                <Label htmlFor={formFields.email.id}>
                  {formFields.email.label}
                </Label>
                <Input
                  id={formFields.email.id}
                  type={formFields.email.type}
                  placeholder={formFields.email.placeholder}
                  {...register("email")}
                />
                {renderFieldError(errors.email?.message?.toString())}
              </div>

              <div className="flex flex-col text-zinc-300 gap-2">
                <Label htmlFor={formFields.password.id}>
                  {formFields.password.label}
                </Label>
                <Input
                  id={formFields.password.id}
                  type={formFields.password.type}
                  placeholder={formFields.password.placeholder}
                  {...register("password")}
                />

                <div className="h-1 text-sm">
                  <PasswordValidationMessage
                    password={password || ""}
                    error={errors.password?.message?.toString()}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col text-zinc-300 gap-2">
                <Label htmlFor={formFields.confirmPassword.id}>
                  {formFields.confirmPassword.label}
                </Label>
                <Input
                  id={formFields.confirmPassword.id}
                  type={formFields.confirmPassword.type}
                  placeholder={formFields.confirmPassword.placeholder}
                  {...register("confirmPassword")}
                />
                {renderFieldError(errors.confirmPassword?.message?.toString())}
              </div>

        
              <div className="flex items-start text-sm gap-2 text-zinc-300">
                <input
                  type="checkbox"
                  id="agreed"
                  {...register("agreed")}
                  className="mt-1 accent-white"
                />
                <label htmlFor="agreed" className="leading-tight">
                  I agree to the {termsLink}
                </label>
              </div>
              {renderFieldError(errors.agreed?.message?.toString())}
            </div>

           
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={buttonStyles.primary}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className={buttonStyles.secondary}
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </button>
            </div>

         
            <div className="text-center text-sm text-zinc-400 mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:underline">
                Log In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}