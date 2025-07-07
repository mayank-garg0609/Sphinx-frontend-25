"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useState } from "react";
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

const formClasses =
  "bg-black/40 backdrop-blur-md text-white p-6 md:p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] w-full max-w-md border border-white/30 space-y-6 font-main max-h-[90vh] overflow-y-auto";

const inputClasses =
  "bg-transparent text-white border border-white/50 rounded-md py-2 px-3 placeholder:text-zinc-400 focus:border-white focus:ring-1 focus:ring-white/20 transition-colors duration-200";

const selectClasses =
  "bg-transparent text-white border border-white/50 rounded-md py-2 px-3 focus:border-white focus:ring-1 focus:ring-white/20 focus:outline-none transition-colors duration-200";

const FormField = memo<{
  field: { key: keyof RegisterFormData; label: string; placeholder: string };
  register: any;
  error?: any;
}>(({ field, register, error }) => (
  <div className="flex flex-col gap-2 text-zinc-300">
    <Label htmlFor={field.key} className="text-sm md:text-base">
      {field.label}
    </Label>
    <Input
      id={field.key}
      placeholder={field.placeholder}
      {...register(field.key)}
      className={inputClasses}
    />
    {error && (
      <span className="text-red-400 text-sm">{error.message?.toString()}</span>
    )}
  </div>
));

FormField.displayName = "FormField";

const GenderSelect = memo<{
  register: any;
  error?: any;
}>(({ register, error }) => (
  <div className="flex flex-col gap-2 text-zinc-300">
    <Label htmlFor="gender" className="text-sm md:text-base">
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
      <span className="text-red-400 text-sm">{error.message?.toString()}</span>
    )}
  </div>
));

GenderSelect.displayName = "GenderSelect";

export default function RegisterPage() {
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit", // Only validate on submit for better performance
    reValidateMode: "onChange", // Re-validate on change after first submit
  });

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

  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={caRegister}
          alt="ascended"
          width={1200}
          height={800}
          placeholder="blur"
          blurDataURL={caRegister.blurDataURL}
          className={`h-full w-full object-cover md:object-contain md:object-left-bottom transition-opacity duration-500 `}
          sizes="(max-width: 768px) 100vw, 1200px"
          priority={false}
          quality={75}
          onLoad={handleImageLoad}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:justify-end md:pr-24">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={formClasses}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #2d2d2d",
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 justify-center">
              <Image
                src={logo}
                alt="Sphinx Logo"
                width={24}
                height={24}
                className="bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                placeholder="blur"
                blurDataURL={logo.blurDataURL}
                priority={true}
                quality={90}
              />
              <h1 className="text-3xl md:text-4xl font-bold">Sphinx'25</h1>
            </div>

            <div className="text-center pt-4 md:pt-6">
              <h2 className="text-xl md:text-2xl font-bold">
                Campus Ambassador Registration
              </h2>
            </div>

            <div className="space-y-4 pt-4">
              {FORM_FIELDS.map((field) => (
                <FormField
                  key={field.key}
                  field={field}
                  register={register}
                  error={errors[field.key]}
                />
              ))}

              <GenderSelect register={register} error={errors.gender} />
            </div>

            <div className="space-y-3 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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
