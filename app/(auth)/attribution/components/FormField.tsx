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
  const isSelect = field.type === "select";
  const isRefCode = field.key === "refCode";
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

  // Handle keyboard navigation for dropdown
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isSelect) return;

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
  }, [isSelect, isOpen]);

  const handleOptionSelect = useCallback((value: string) => {
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

  const getSelectedLabel = () => {
    if (!selectedValue || !field.options) return field.placeholder;
    const option = field.options.find(opt => opt.value === selectedValue);
    return option?.label || field.placeholder;
  };

  const getValidationRules = () => {
    const rules: any = {};

    if (field.key === "source") {
      rules.required = "Please select how you heard about us";
    }

    if (isRefCode) {
      rules.pattern = {
        value: /^SPH[A-Z0-9]{4}$/i,
        message: "Referral code should be in format: SPH**** (e.g., SPHA123)"
      };
      rules.minLength = {
        value: 7,
        message: "Referral code must be 7 characters long"
      };
      rules.maxLength = {
        value: 7,
        message: "Referral code must be 7 characters long"
      };
    }

    return rules;
  };

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    
    // Format referral code (convert to uppercase)
    if (isRefCode) {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
      event.target.value = value;
    }
    
    return value;
  }, [isRefCode]);

  return (
    <div className="relative flex flex-col gap-1.5 sm:gap-2 text-zinc-300">
      <Label htmlFor={field.key} className="text-sm sm:text-base font-medium">
        {field.label}
        {field.key === "source" && (
          <span className="text-red-400 ml-1" aria-label="required field">
            *
          </span>
        )}
      </Label>

      {isSelect ? (
        <div className="relative w-full" ref={dropdownRef}>
          {/* Hidden select for form submission */}
          <select
            id={field.key}
            {...register(field.key, getValidationRules())}
            className="sr-only"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.key}-error` : undefined}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
              {getSelectedLabel()}
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
          {isOpen && field.options && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
              
              <ul 
                className="absolute top-full left-0 right-0 mt-1 bg-black/90 backdrop-blur-md border border-white/30 rounded-md shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto"
                role="listbox"
                aria-label={field.label}
              >
                {field.options.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={selectedValue === option.value}
                  >
                    <button
                      type="button"
                      onClick={() => handleOptionSelect(option.value)}
                      className={`w-full px-3 py-2.5 text-left text-white hover:bg-white/10 transition-colors duration-200 focus:bg-white/10 focus:outline-none ${
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
          type="text"
          placeholder={field.placeholder}
          {...register(field.key, getValidationRules())}
          onChange={handleInputChange}
          className={`${inputClasses} ${
            error ? 'border-red-500 focus:border-red-500' : 'focus:border-white'
          }`}
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error ? `${field.key}-error` : undefined}
          maxLength={isRefCode ? 7 : undefined}
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
      {!error && isRefCode && (
        <span className="text-zinc-400 text-xs leading-tight">
          Optional - Enter CA referral code (Format: SPH****)
        </span>
      )}
    </div>
  );
});

FormField.displayName = "FormField";