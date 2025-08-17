import { memo, useState, useCallback, useRef, useEffect } from "react";
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
  const isPhone = field.key === "phone_no";
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
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation for dropdown
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isGender) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case "Escape":
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        setIsOpen(true);
        break;
    }
  }, [isGender, isOpen]);

  const handleGenderSelect = useCallback((value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    
    // Trigger form validation
    const event = {
      target: { name: field.key, value: value }
    };
    const registerField = register(field.key);
    if (registerField && registerField.onChange) {
      registerField.onChange(event);
    }
    
    // Focus back to button
    setTimeout(() => buttonRef.current?.focus(), 0);
  }, [field.key, register]);

  const getInputValidation = useCallback(() => {
    const validation: any = {};

    if (isPhone) {
      validation.pattern = {
        value: /^[6-9]\d{9}$/,
        message: "Please enter a valid 10-digit mobile number"
      };
      validation.minLength = {
        value: 10,
        message: "Phone number must be 10 digits"
      };
      validation.maxLength = {
        value: 10,
        message: "Phone number must be 10 digits"
      };
    }

    if (field.key === "college_id") {
      validation.minLength = {
        value: 5,
        message: "College ID must be at least 5 characters"
      };
    }

    if (field.key === "college_name" || field.key === "college_branch") {
      validation.minLength = {
        value: 2,
        message: `${field.label} must be at least 2 characters`
      };
    }

    return validation;
  }, [field.key, field.label, isPhone]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    
    // Format phone number (remove non-digits)
    if (isPhone) {
      value = value.replace(/\D/g, '').slice(0, 10);
      event.target.value = value;
    }
    
    return value;
  }, [isPhone]);

  return (
    <div className="relative flex flex-col gap-1.5 sm:gap-2 text-zinc-300">
      <Label 
        htmlFor={field.key} 
        className="text-sm sm:text-base font-medium"
      >
        {field.label}
        <span className="text-red-400 ml-1" aria-label="required field">*</span>
      </Label>

      {isGender ? (
        <div className="relative w-full" ref={dropdownRef}>
          {/* Hidden select for form submission */}
          <select
            id={field.key}
            {...register(field.key, {
              required: `${field.label} is required`
            })}
            className="sr-only"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.key}-error` : undefined}
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          
          {/* Custom dropdown button */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            className={`${selectClasses} flex items-center justify-between cursor-pointer ${
              error ? 'border-red-500 focus:border-red-500' : 'focus:border-white'
            }`}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={`${field.label}, ${selectedValue || 'no selection'}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.key}-error` : undefined}
          >
            <span className={selectedValue ? "text-white" : "text-zinc-400"}>
              {selectedValue ? GENDER_OPTIONS.find(opt => opt.value === selectedValue)?.label : field.placeholder}
            </span>
            <svg
              className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown options */}
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
              
              <ul 
                className="absolute top-full left-0 right-0 mt-1 bg-black/90 backdrop-blur-md border border-white/30 rounded-md shadow-lg z-50 overflow-hidden"
                role="listbox"
                aria-label={field.label}
              >
                {GENDER_OPTIONS.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={selectedValue === option.value}
                  >
                    <button
                      type="button"
                      onClick={() => handleGenderSelect(option.value)}
                      className={`w-full px-3 py-2.5 text-left text-white hover:bg-white/10 transition-colors duration-200 focus:bg-white/10 focus:outline-none ${
                        index === 0 ? 'rounded-t-md' : ''
                      } ${index === GENDER_OPTIONS.length - 1 ? 'rounded-b-md' : ''} ${
                        selectedValue === option.value ? 'bg-white/10' : ''
                      }`}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <Input
          id={field.key}
          type={isPhone ? "tel" : "text"}
          placeholder={field.placeholder}
          {...register(field.key, {
            required: `${field.label} is required`,
            ...getInputValidation()
          })}
          onChange={handleInputChange}
          className={`${inputClasses} ${
            error ? 'border-red-500 focus:border-red-500' : 'focus:border-white'
          }`}
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error ? `${field.key}-error` : undefined}
          inputMode={isPhone ? "numeric" : "text"}
          maxLength={isPhone ? 10 : undefined}
        />
      )}

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

      {/* Field help text */}
      {!error && isPhone && (
        <span className="text-zinc-400 text-xs leading-tight">
          Enter your 10-digit mobile number (starting with 6-9)
        </span>
      )}
      
      {!error && field.key === "college_id" && (
        <span className="text-zinc-400 text-xs leading-tight">
          Enter your college roll number or student ID
        </span>
      )}
    </div>
  );
});

FormField.displayName = "FormField";