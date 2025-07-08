"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useState, useMemo } from "react";
import {
  RegisterFormData,
  registerSchema,
} from "../../../schemas/registerSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import logo from "@/public/image/logo.webp";
import caRegister from "@/public/image/caRegister.webp";

const FORM_FIELDS: {
  key: keyof RegisterFormData;
  label: string;
  placeholder: string;
}[] = [
  { key: "name", label: "Full Name", placeholder: "John Doe" },
  { key: "age", label: "Age", placeholder: "20" },
  { key: "phone", label: "Phone Number", placeholder: "9876543210" },
  { key: "email", label: "Email Address", placeholder: "example@email.com" },
  { key: "college", label: "College Name", placeholder: "ABC College" },
  { key: "college_city", label: "College City", placeholder: "Jaipur" },
  { key: "college_state", label: "College State", placeholder: "Rajasthan" },
  { key: "collegeId", label: "College ID", placeholder: "2023uch1219" },
  { key: "branch", label: "Branch", placeholder: "Chemical Engg" },
  { key: "graduation_year", label: "Graduation Year", placeholder: "2027" },
];

// Optimized class strings with mobile-first approach
const formClasses =
  "bg-black/40 backdrop-blur-md text-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] w-full max-w-sm sm:max-w-md border border-white/30 space-y-4 sm:space-y-6 font-main max-h-[85vh] sm:max-h-[90vh] overflow-y-auto";

const inputClasses =
  "bg-transparent text-white border border-white/50 rounded-md py-2.5 sm:py-2 px-3 placeholder:text-zinc-400 focus:border-white focus:ring-1 focus:ring-white/20 transition-colors duration-200 text-sm sm:text-base min-h-[44px] sm:min-h-[40px]";

const selectClasses =
  "bg-transparent text-white border border-white/50 rounded-md py-2.5 sm:py-2 px-3 focus:border-white focus:ring-1 focus:ring-white/20 focus:outline-none transition-colors duration-200 text-sm sm:text-base min-h-[44px] sm:min-h-[40px]";

// Memoized FormField component with mobile optimizations
const FormField = memo<{
  field: { key: keyof RegisterFormData; label: string; placeholder: string };
  register: any;
  error?: any;
}>(({ field, register, error }) => (
  <div className="flex flex-col gap-1.5 sm:gap-2 text-zinc-300">
    <Label htmlFor={field.key} className="text-sm sm:text-base font-medium">
      {field.label}
    </Label>
    <Input
      id={field.key}
      placeholder={field.placeholder}
      {...register(field.key)}
      className={inputClasses}
      autoComplete="off"
    />
    {error && (
      <span className="text-red-400 text-xs sm:text-sm leading-tight">
        {error.message?.toString()}
      </span>
    )}
  </div>
));

FormField.displayName = "FormField";

// Memoized GenderSelect component with mobile optimizations
const GenderSelect = memo<{
  register: any;
  error?: any;
}>(({ register, error }) => (
  <div className="flex flex-col gap-1.5 sm:gap-2 text-zinc-300">
    <Label htmlFor="gender" className="text-sm sm:text-base font-medium">
      Gender
    </Label>
    <select id="gender" {...register("gender")} className={selectClasses}>
      <option value="" disabled hidden className="text-zinc-400">
        Select your gender
      </option>
      <option value="male" className="text-black bg-white">
        Male
      </option>
      <option value="female" className="text-black bg-white">
        Female
      </option>
      <option value="other" className="text-black bg-white">
        Other
      </option>
    </select>
    {error && (
      <span className="text-red-400 text-xs sm:text-sm leading-tight">
        {error.message?.toString()}
      </span>
    )}
  </div>
));

GenderSelect.displayName = "GenderSelect";

// Memoized loading spinner component
const LoadingSpinner = memo(() => (
  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
));

LoadingSpinner.displayName = "LoadingSpinner";

export default function RegisterPage() {
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Memoized submit handler for better performance
  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      console.log("🚀 Submitting Registration:", data);
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const result = await res.json();
          console.log("✅ Registered:", result);
          reset();
          toast.success("Account created successfully!");
        } else {
          const error = await res.json();
          toast.error(error.message || "Registration failed.");
        }
      } catch (err) {
        console.error("❌ Network error:", err);
        toast.error("Check your connection and try again.");
      }
    },
    [reset]
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Memoized form fields to prevent unnecessary re-renders
  const memoizedFormFields = useMemo(
    () =>
      FORM_FIELDS.map((field) => (
        <FormField
          key={field.key}
          field={field}
          register={register}
          error={errors[field.key]}
        />
      )),
    [register, errors]
  );

  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden">
      {/* Background Image - Mobile: covers entire screen, Desktop: positioned left-bottom */}
      <div className="absolute inset-0 z-0">
        <Image
          src={caRegister}
          alt="ascended"
          width={1200}
          height={800}
          placeholder="blur"
          blurDataURL={caRegister.blurDataURL}
          className={`h-full w-full object-contain lg:object-contain lg:object-left-bottom transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 1024px) 100vw, 1200px"
          priority={false}
          quality={75}
          onLoad={handleImageLoad}
        />
      </div>

      {/* Form Container - Mobile: centered, Desktop: positioned right */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 lg:justify-end lg:pr-24">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={formClasses}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #2d2d2d",
          }}
        >
          <div className="flex flex-col gap-3 ">
            {/* Header Section */}
            <div className="flex flex-col gap-2 ">
              <div className="flex items-center gap-3 justify-center">
                <Image
                  src={logo}
                  alt="Sphinx Logo"
                  width={20}
                  height={20}
                  className="bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] sm:w-6 sm:h-6"
                  placeholder="blur"
                  blurDataURL={logo.blurDataURL}
                  priority={true}
                  quality={90}
                />
                <h1 className="text-3xl lg:text-4xl font-bold">
                  Sphinx'25
                </h1>
              </div>

              <div className="text-center pt-2 sm:pt-4 lg:pt-6">
                <h2 className="text-xl lg:text-2xl font-bold leading-tight">
                  Campus Ambassador Registration
                </h2>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 pt-4">
              {memoizedFormFields}
              <GenderSelect register={register} error={errors.gender} />
            </div>

            {/* Submit Button */}
            <div className="space-y-3 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-semibold py-3 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] text-sm sm:text-base min-h-[48px] sm:min-h-[44px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner />
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}