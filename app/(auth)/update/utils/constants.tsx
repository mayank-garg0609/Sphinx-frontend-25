import { FormField } from "../types/registrations";

export const FORM_FIELDS: FormField[] = [
  { key: "phone_no", label: "Phone Number", placeholder: "9876543210" },
  { key: "college_name", label: "College Name", placeholder: "ABC College" },
  { key: "city", label: "College City", placeholder: "Jaipur" },
  { key: "state", label: "College State", placeholder: "Rajasthan" },
  { key: "college_id", label: "College ID", placeholder: "2023uch1219" },
  { key: "college_branch", label: "Branch", placeholder: "Chemical Engg" },
  { key: "gender", label: "Gender", placeholder: "Select your gender" },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const formClasses =
  "bg-black/40 backdrop-blur-md text-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] w-full max-w-sm sm:max-w-md border border-white/30 space-y-4 sm:space-y-6 font-main max-h-[89vh] sm:max-h-[93vh] overflow-y-auto relative";

export const inputClasses =
  "bg-transparent text-white border border-white/50 rounded-md py-2.5 sm:py-2 px-3 placeholder:text-zinc-400 focus:border-white focus:ring-1 focus:ring-white/20 transition-colors duration-200 text-sm sm:text-base min-h-[44px] sm:min-h-[40px]";

export const selectClasses =
  "bg-transparent text-white border border-white/50 rounded-md py-2.5 sm:py-2 px-3 focus:border-white focus:ring-1 focus:ring-white/20 focus:outline-none transition-colors duration-200 text-sm sm:text-base min-h-[44px] sm:min-h-[40px] w-full appearance-none";

export const buttonClasses =
  "w-full bg-white text-black font-semibold py-3 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] text-sm sm:text-base min-h-[48px] sm:min-h-[44px]";
