import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inputClasses } from "../utils/constants";
import { CaRegisterFormData } from "../types/CARegistrations";

export interface FormFieldDefinition {
  key: keyof CaRegisterFormData;
  label: string;
  placeholder: string;
}

export interface FormFieldProps {
  field: FormFieldDefinition;
  register: any;
  error?: any;
}

export const FormField = memo<FormFieldProps>(({ field, register, error }) => {
  return (
    <div className="relative flex flex-col gap-1.5 sm:gap-2 text-zinc-300">
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

      <span
        className="text-red-400 text-xs sm:text-sm leading-tight min-h-[1.25rem]" // 1.25rem = 20px approx
        aria-live="polite"
      >
        {error?.message?.toString() || "\u00A0" /* non-breaking space */}
      </span>
    </div>
  );
});

FormField.displayName = "FormField";
