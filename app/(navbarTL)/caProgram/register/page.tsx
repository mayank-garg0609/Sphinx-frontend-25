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

interface form_fields {
  key: keyof RegisterFormData;
  label: string;
  placeholder: string;
}

const FORM_FIELDS: form_fields[] = [
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
  { key: "gender", label: "Gender", placeholder: "Select your gender" },
];

const formClasses =
  "bg-black/40 backdrop-blur-md text-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] w-full max-w-sm sm:max-w-md border border-white/30 space-y-4 sm:space-y-6 font-main max-h-[85vh] sm:max-h-[90vh] overflow-y-auto relative";

const inputClasses =
  "bg-transparent text-white border border-white/50 rounded-md py-2.5 sm:py-2 px-3 placeholder:text-zinc-400 focus:border-white focus:ring-1 focus:ring-white/20 transition-colors duration-200 text-sm sm:text-base min-h-[44px] sm:min-h-[40px]";

const selectClasses =
  "bg-transparent text-white border border-white/50 rounded-md py-2.5 sm:py-2 px-3 focus:border-white focus:ring-1 focus:ring-white/20 focus:outline-none transition-colors duration-200 text-sm sm:text-base min-h-[44px] sm:min-h-[40px] w-full appearance-none";

const FormField = memo<{
  field: form_fields;
  register: any;
  error?: any;
}>(({ field, register, error }) => {
  const isGender = field.key === "gender";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const handleGenderSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    const event = {
      target: { name: field.key, value: value }
    };
    register(field.key).onChange(event);
  };

  return (
    <div className="relative flex flex-col gap-1.5 sm:gap-2 text-zinc-300">
      <Label htmlFor={field.key} className="text-sm sm:text-base font-medium">
        {field.label}
      </Label>

      {isGender ? (
        <div className="relative w-full">
          <select
            id={field.key}
            {...register(field.key)}
            className="sr-only"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`${selectClasses} flex items-center justify-between cursor-pointer`}
          >
            <span className={selectedValue ? "text-white" : "text-zinc-400"}>
              {selectedValue ? genderOptions.find(opt => opt.value === selectedValue)?.label : "Select your gender"}
            </span>
            <svg
              className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />
              
              <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 backdrop-blur-md border border-white/30 rounded-md shadow-lg z-50 overflow-hidden">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleGenderSelect(option.value)}
                    className="w-full px-3 py-2.5 text-left text-white hover:bg-white/10 transition-colors duration-200 first:rounded-t-md last:rounded-b-md"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <Input
          id={field.key}
          placeholder={field.placeholder}
          {...register(field.key)}
          className={inputClasses}
          autoComplete="off"
        />
      )}

      {error && (
        <span className="text-red-400 text-xs sm:text-sm leading-tight">
          {error.message?.toString()}
        </span>
      )}
    </div>
  );
});

FormField.displayName = "FormField";



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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 lg:justify-end lg:pr-24">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={formClasses}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #2d2d2d",
            position: 'relative',
            zIndex: 10,
            isolation: 'isolate'
          }}
        >
          <div className="flex flex-col gap-3 ">
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
                <h1 className="text-3xl lg:text-4xl font-bold">Sphinx'25</h1>
              </div>

              <div className="text-center pt-2 sm:pt-4 lg:pt-6">
                <h2 className="text-xl lg:text-2xl font-bold leading-tight">
                  Campus Ambassador Registration
                </h2>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {memoizedFormFields}
            </div>

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