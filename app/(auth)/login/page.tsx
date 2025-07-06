"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { Text, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import logo from "@/public/image/logo.webp";
import ascended from "@/public/image/ascended.webp";
import { loginSchema, LoginFormData } from "../../schemas/loginSchema";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [passwordStrength, setPasswordStrength] = useState<
    "Weak" | "Medium" | "Strong" | ""
  >("");

  const password = watch("password");

  useEffect(() => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length < 8) {
      setPasswordStrength("Weak");
    } else if (hasUpper && hasLower && hasNumber && hasSpecial) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Medium");
    }
  }, [password]);

  const onSubmit = async (data: LoginFormData) => {
    console.log("🔐 Logging in with:", data);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("✅ Login successful:", result);
        reset();
        toast.success("✅ Logged in successfully!");
        // You might redirect the user here
      } else {
        const error = await res.json();
        console.error("❌ Server error:", error);
        toast.error(error.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("🚨 Network error:", err);
      toast.error("Network error. Please check your connection.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-black bg-cover bg-center bg-no-repeat px-4">
      <Image
        src={ascended}
        alt="ascended human image"
        placeholder="blur"
        blurDataURL={ascended.blurDataURL}
        className="h-[840px] w-auto object-contain justify-start absolute bottom-0 left-48"
      />

      <div className="relative z-10 flex justify-end w-full items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-black/30 backdrop-blur-md text-white p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] w-full max-w-md border border-white/30 space-y-6 font-main mr-36 h-[70vh] overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #2d2d2d",
          }}
        >
          <Flex direction="column" gap="2">
            {/* Logo */}
            <div className="flex items-center gap-3 justify-center">
              <Image
                className="w-6 h-6 bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                src={logo}
                alt="Sphinx Logo"
                placeholder="blur"
                blurDataURL={logo.blurDataURL}
              />
              <Text size="7" weight="bold" className="text-white">
                Sphinx'25
              </Text>
            </div>

            {/* Header */}
            <div className="text-center pt-6 flex flex-col space-y-2">
              <Text size="5" weight="bold">
                Welcome Back
              </Text>
              <Text size="2" className="text-zinc-400">
                Log in to your account
              </Text>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 pt-6 pb-6">
              {/* Email */}
              <div className="flex flex-col text-zinc-300 gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register("email")}
                />
                <span className="text-sm h-1 block">
                  {errors.email?.message && (
                    <span className="text-red-400">
                      {errors.email.message.toString()}
                    </span>
                  )}
                </span>
              </div>

              {/* Password */}
              <div className="flex flex-col text-zinc-300 gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />

                <div className="h-1 text-sm">
                  {errors.password?.message ? (
                    <span className="text-red-400">
                      {errors.password.message.toString()}
                    </span>
                  ) : password ? (
                    <span
                      className={
                        password.length < 8
                          ? "text-red-400"
                          : passwordStrength === "Strong"
                          ? "text-green-400"
                          : passwordStrength === "Medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }
                    >
                      {password.length < 8
                        ? "Password is too short."
                        : `Password Strength: ${passwordStrength}`}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition"
              >
                {isSubmitting ? "Logging In..." : "Log In"}
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center  border border-white text-white font-medium py-2 rounded-lg hover:bg-white hover:text-black transition"
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-zinc-400 mt-2">
              Don’t have an account?{" "}
              <Link href="/sign-up" className="text-blue-400 hover:underline">
                Sign Up
              </Link>
            </div>
          </Flex>
        </form>
      </div>
    </div>
  );
}
