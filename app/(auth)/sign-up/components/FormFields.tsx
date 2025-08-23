'use client';

import { memo, useCallback, useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { SignUpFormData } from '@/app/schemas/signupSchema';
import type { FormField as FormFieldType } from '../utils/constants';
import { ACCESSIBILITY, SECURITY, MESSAGES } from '../utils/constants';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  readonly field: FormFieldType;
  readonly register: UseFormRegister<SignUpFormData>;
  readonly error?: string;
  readonly disabled?: boolean;
  readonly children?: React.ReactNode;
}

export const FormField = memo(function FormField({
  field,
  register,
  error,
  disabled = false,
  children,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);
  const isPasswordField = field.type === 'password';

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const getInputType = useCallback(() => {
    if (isPasswordField) {
      return showPassword ? 'text' : 'password';
    }
    return field.type;
  }, [isPasswordField, showPassword, field.type]);

  const getValidationProps = useCallback(() => {
    const props: Record<string, any> = {};
    
    if (field.minLength) props.minLength = field.minLength;
    if (field.maxLength) props.maxLength = field.maxLength;
    if (field.pattern) props.pattern = field.pattern;
    if (field.autoComplete) props.autoComplete = field.autoComplete;
    
    props.spellCheck = false;
    props.autoCapitalize = 'none';
    props.autoCorrect = 'off';
    
    if (isPasswordField) {
      props['data-1p-ignore'] = true;
      props['data-lpignore'] = true;
    }
    
    return props;
  }, [field, isPasswordField]);

  const getAriaAttributes = useCallback(() => {
    const ariaLabel = field.id === 'name' 
      ? ACCESSIBILITY.ARIA_LABELS.NAME_INPUT
      : field.id === 'email'
      ? ACCESSIBILITY.ARIA_LABELS.EMAIL_INPUT
      : field.id === 'password'
      ? ACCESSIBILITY.ARIA_LABELS.PASSWORD_INPUT
      : field.id === 'confirmPassword'
      ? ACCESSIBILITY.ARIA_LABELS.CONFIRM_PASSWORD_INPUT
      : field.label;

    return {
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `${field.id}-error` : undefined,
      'aria-label': ariaLabel,
      'aria-required': field.required,
    };
  }, [hasError, field.id, field.required, field.label]);

  return (
    <div className="group space-y-2">
      {/* Modern Floating Label */}
      <div className="relative">
        <Input
          id={field.id}
          type={getInputType()}
          placeholder=" "
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          // onBlur={() => setIsFocused(false)}
          {...register(field.id as keyof SignUpFormData, {
            required: field.required ? MESSAGES.ERRORS.REQUIRED_FIELD : false,
            pattern: field.type === 'email' ? {
              value: SECURITY.INPUT_VALIDATION.EMAIL_REGEX,
              message: MESSAGES.ERRORS.INVALID_EMAIL,
            } : undefined,
            minLength: field.minLength ? {
              value: field.minLength,
              message: field.id === 'name' 
                ? MESSAGES.ERRORS.NAME_TOO_SHORT
                : field.type === 'password' 
                  ? MESSAGES.ERRORS.PASSWORD_TOO_SHORT 
                  : `Must be at least ${field.minLength} characters`,
            } : undefined,
            maxLength: field.maxLength ? {
              value: field.maxLength,
              message: field.id === 'name'
                ? MESSAGES.ERRORS.NAME_TOO_LONG
                : field.type === 'email' 
                  ? MESSAGES.ERRORS.EMAIL_TOO_LONG 
                  : field.type === 'password'
                    ? MESSAGES.ERRORS.PASSWORD_TOO_LONG
                    : `Must be no more than ${field.maxLength} characters`,
            } : undefined,
          })}
          {...getValidationProps()}
          {...getAriaAttributes()}
          className={`
            peer w-full h-11 px-3 pt-4 pb-1 text-sm
            bg-white/5 backdrop-blur-sm
            border-2 border-white/20 rounded-lg
            text-white placeholder-transparent
            transition-all duration-300 ease-out
            focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:bg-white/10
            hover:border-white/30 hover:bg-white/8
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError 
              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20 bg-red-500/5' 
              : ''
            }
            ${isPasswordField ? 'pr-10' : ''}
            ${isFocused ? 'shadow-lg shadow-blue-500/10' : ''}
          `}
          data-testid={`${field.id}-input`}
        />
        
        <Label 
          htmlFor={field.id}
          className={`
            absolute left-3 transition-all duration-300 ease-out pointer-events-none text-xs
            peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/60
            peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:font-medium
            ${hasError ? 'peer-focus:text-red-400' : ''}
            top-1 font-medium text-white/80
          `}
        >
          {field.label}
          {field.required && (
            <span className="text-red-400 ml-1" aria-label="required field">*</span>
          )}
        </Label>
        
        {/* Password Visibility Toggle */}
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              p-1 rounded-lg
              text-white/60 hover:text-white hover:bg-white/10
              disabled:opacity-50 disabled:cursor-not-allowed 
              focus:outline-none focus:ring-2 focus:ring-blue-400/50
              transition-all duration-200
            "
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            data-testid="password-toggle"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-4 h-4" aria-hidden="true" />
            ) : (
              <EyeIcon className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {hasError && (
        <div 
          id={`${field.id}-error`}
          className="flex items-start gap-2 text-red-400 text-sm animate-in slide-in-from-top-1 duration-300"
          role="alert"
          aria-live={ACCESSIBILITY.LIVE_REGIONS.ASSERTIVE}
          data-testid={`${field.id}-error`}
        >
          <svg 
            className="w-4 h-4 mt-0.5 flex-shrink-0" 
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
          <span>{error}</span>
        </div>
      )}
      
      {/* Field Help Text or Children */}
      {!hasError && children && (
        <div className="text-sm text-white/70 px-1">
          {children}
        </div>
      )}
      
      {/* Password field help text */}
      {field.type === 'password' && !hasError && !children && (
        <div 
          className="text-sm text-white/60 px-1 flex items-center gap-2"
          id={`${field.id}-help`}
          aria-live={ACCESSIBILITY.LIVE_REGIONS.POLITE}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Must be at least {SECURITY.INPUT_VALIDATION.MIN_PASSWORD_LENGTH} characters
        </div>
      )}
    </div>
  );
});