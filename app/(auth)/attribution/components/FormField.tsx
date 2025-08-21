import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField as FormFieldType } from "../types/registrations";
import { inputClasses, selectClasses } from "../utils/constants";

interface FormFieldProps {
  field: FormFieldType;
  register: any;
  error?: any;
}

export const FormField = memo<FormFieldProps>(({ field, register, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative flex flex-col gap-1.5 sm:gap-2 text-zinc-300">
      <Label htmlFor={field.key} className="text-sm sm:text-base font-medium">
        {field.label}
        <span className="text-red-400 ml-1" aria-label="required field">
          *
        </span>
      </Label>

      {/* Error message */}
      {error && (
        <span
          id={`${field.key}-error`}
          className="text-red-400 text-xs sm:text-sm leading-tight flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error.message?.toString()}
        </span>
      )}


      { field.key === "refCode" && (
        <span className="text-zinc-400 text-xs leading-tight">
          Enter your college roll number or student ID
        </span>
      )}
    </div>
  );
});

FormField.displayName = "FormField";
