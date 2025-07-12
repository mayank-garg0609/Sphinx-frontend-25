import { memo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField as FormFieldType } from "../types/registrations";
import { GENDER_OPTIONS } from "../utils/constants";
import { inputClasses, selectClasses } from "../utils/constants";

interface FormFieldProps {
  field: FormFieldType;
  register: any;
  error?: any;
}

export const FormField = memo<FormFieldProps>(({ field, register, error }) => {
  const isGender = field.key === "gender";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

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
              {selectedValue ? GENDER_OPTIONS.find(opt => opt.value === selectedValue)?.label : "Select your gender"}
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
                {GENDER_OPTIONS.map((option) => (
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