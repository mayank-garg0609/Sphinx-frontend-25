import { FormField } from "../types/CARegistrations";

export const FORM_FIELDS: FormField[] = [
  {
    key: "how_did_you_find_us",
    label: "How did you find out about us?",
    placeholder: "e.g., Social media, friend, campus event...",
  },
  {
    key: "why_should_we_choose_you",
    label: "Why should we choose you?",
    placeholder: "Describe why you are a good fit for the CA program...",
  },
  {
    key: "past_experience",
    label: "Any past experience?",
    placeholder: "Share any past campus ambassador or leadership roles...",
  },
  {
    key: "your_strengths",
    label: "What are your strengths?",
    placeholder: "Mention key skills or qualities that set you apart...",
  },
  {
    key: "your_expectations",
    label: "Your expectations from the program?",
    placeholder: "What do you hope to gain or learn from this?",
  },
];

export const formClasses =
  "bg-black/40 backdrop-blur-md text-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] w-full max-w-sm sm:max-w-md border border-white/30 space-y-4 sm:space-y-6 font-main max-h-[89vh] sm:max-h-[93vh] overflow-y-auto relative";

export const inputClasses =
  "bg-transparent text-white border border-white/50 rounded-md py-2.5 sm:py-2 px-3 placeholder:text-zinc-400 focus:border-white focus:ring-1 focus:ring-white/20 transition-colors duration-200 text-sm sm:text-base min-h-[44px] sm:min-h-[40px]";

export const selectClasses =
  "bg-transparent text-white border border-white/50 rounded-md py-2.5 sm:py-2 px-3 focus:border-white focus:ring-1 focus:ring-white/20 focus:outline-none transition-colors duration-200 text-sm sm:text-base min-h-[44px] sm:min-h-[40px] w-full appearance-none";

export const buttonClasses =
  "w-full bg-white text-black font-semibold py-3 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] text-sm sm:text-base min-h-[48px] sm:min-h-[44px]";
