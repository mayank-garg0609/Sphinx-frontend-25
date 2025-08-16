'use client';

import { memo, useCallback, useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { LoginFormData } from '@/app/schemas/loginSchema';
import type { FormField as FormFieldType } from '../utils/constants';
import { ACCESSIBILITY, SECURITY, MESSAGES } from '../utils/constants';

// Simple UI Components (replacing missing imports)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = memo(function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const Label = memo(function Label({ className = '', ...props }: LabelProps) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  );
});

interface FormFieldProps {
  readonly field: FormFieldType;
  readonly register: UseFormRegister<LoginFormData>;
  readonly error?: string;
  readonly disabled?: boolean;
}

export const FormField = memo(function FormField({
  field,
  register,
  error,
  disabled = false,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = Boolean(error);
  const isPasswordField = field.type === 'password';

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Get appropriate input type
  const getInputType = useCallback(() => {
    if (isPasswordField) {
      return showPassword ? 'text' : 'password';
    }
    return field.type;
  }, [isPasswordField, showPassword, field.type]);

  // Enhanced validation attributes
  const getValidationProps = useCallback(() => {
    const props: Record<string, any> = {};
    
    if (field.minLength) props.minLength = field.minLength;
    if (field.maxLength) props.maxLength = field.maxLength;
    if (field.pattern) props.pattern = field.pattern;
    if (field.autoComplete) props.autoComplete = field.autoComplete;
    
    // Security attributes
    props.spellCheck = false;
    props.autoCapitalize = 'none';
    props.autoCorrect = 'off';
    
    // Additional security for password fields
    if (isPasswordField) {
      props['data-1p-ignore'] = true; // Disable 1Password on password confirm fields
      props['data-lpignore'] = true; // Disable LastPass
    }
    
    return props;
  }, [field, isPasswordField]);

  // Get ARIA attributes
  const getAriaAttributes = useCallback(() => {
    return {
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `${field.id}-error` : undefined,
      'aria-label': isPasswordField 
        ? ACCESSIBILITY.ARIA_LABELS.PASSWORD_INPUT 
        : ACCESSIBILITY.ARIA_LABELS.EMAIL_INPUT,
      'aria-required': field.required,
    };
  }, [hasError, field.id, field.required, isPasswordField]);

  return (
    <div className="flex flex-col text-zinc-300 gap-1.5 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-2.5 2xl:gap-3">
      {/* Label */}
      <Label 
        htmlFor={field.id} 
        className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium"
      >
        {field.label}
        {field.required && (
          <span 
            className="text-red-400 ml-1" 
            aria-label="required field"
            role="img"
          >
            *
          </span>
        )}
      </Label>
      
      {/* Input Container */}
      <div className="relative">
        <Input
          id={field.id}
          type={getInputType()}
          placeholder={field.placeholder}
          disabled={disabled}
          {...register(field.id as keyof LoginFormData, {
            required: field.required ? MESSAGES.ERRORS.REQUIRED_FIELD : false,
            pattern: field.type === 'email' ? {
              value: SECURITY.INPUT_VALIDATION.EMAIL_REGEX,
              message: MESSAGES.ERRORS.INVALID_EMAIL,
            } : undefined,
            minLength: field.minLength ? {
              value: field.minLength,
              message: field.type === 'password' 
                ? MESSAGES.ERRORS.PASSWORD_TOO_SHORT 
                : `Must be at least ${field.minLength} characters`,
            } : undefined,
            maxLength: field.maxLength ? {
              value: field.maxLength,
              message: field.type === 'email' 
                ? MESSAGES.ERRORS.EMAIL_TOO_LONG 
                : field.type === 'password'
                  ? MESSAGES.ERRORS.PASSWORD_TOO_LONG
                  : `Must be no more than ${field.maxLength} characters`,
            } : undefined,
          })}
          {...getValidationProps()}
          {...getAriaAttributes()}
          className={`text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl py-2 sm:py-2 md:py-2 lg:py-2 xl:py-3 2xl:py-4 h-8 sm:h-9 md:h-10 lg:h-auto xl:h-auto 2xl:h-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
            hasError ? 'border-red-500 focus:border-red-500 ring-red-500' : 'focus:ring-white'
          } ${isPasswordField ? 'pr-10' : ''}`}
          data-testid={`${field.id}-input`}
        />
        
        {/* Password Visibility Toggle */}
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:text-zinc-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
            data-testid="password-toggle"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            ) : (
              <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {hasError && (
        <span 
          id={`${field.id}-error`}
          className="text-red-400 text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base 2xl:text-lg flex items-center gap-1"
          role="alert"
          aria-live={ACCESSIBILITY.LIVE_REGIONS.ASSERTIVE}
          data-testid={`${field.id}-error`}
        >
          <svg 
            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" 
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
          {error}
        </span>
      )}
      
      {/* Field Help Text */}
      {field.type === 'password' && !hasError && (
        <span 
          className="text-zinc-400 text-xs sm:text-xs md:text-xs lg:text-sm"
          id={`${field.id}-help`}
          aria-live={ACCESSIBILITY.LIVE_REGIONS.POLITE}
        >
          Must be at least {SECURITY.INPUT_VALIDATION.MIN_PASSWORD_LENGTH} characters
        </span>
      )}
    </div>
  );
});