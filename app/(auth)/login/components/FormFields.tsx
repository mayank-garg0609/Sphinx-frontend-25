'use client';

import { memo, useCallback, useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { LoginFormData } from '@/app/schemas/loginSchema';
import type { FormField as FormFieldType } from '../utils/constants';
import { ACCESSIBILITY, SECURITY, MESSAGES } from '../utils/constants';
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

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
    <div className="space-y-2">
      {/* Label */}
      <Label 
        htmlFor={field.id} 
        className="text-sm font-medium text-zinc-200"
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
          className={`
            h-12 px-4 text-white bg-zinc-800/50 border border-zinc-600 rounded-lg
            placeholder:text-zinc-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed 
            transition-all duration-200
            ${hasError ? 'border-red-500 focus:ring-red-500' : 'hover:border-zinc-500'}
            ${isPasswordField ? 'pr-12' : ''}
          `}
          data-testid={`${field.id}-input`}
        />
        
        {/* Password Visibility Toggle */}
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
            data-testid="password-toggle"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" aria-hidden="true" />
            ) : (
              <EyeIcon className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {hasError && (
        <span 
          id={`${field.id}-error`}
          className="text-red-400 text-sm flex items-center gap-2"
          role="alert"
          aria-live={ACCESSIBILITY.LIVE_REGIONS.ASSERTIVE}
          data-testid={`${field.id}-error`}
        >
          <svg 
            className="w-4 h-4 flex-shrink-0" 
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
          className="text-zinc-500 text-sm"
          id={`${field.id}-help`}
          aria-live={ACCESSIBILITY.LIVE_REGIONS.POLITE}
        >
          Must be at least {SECURITY.INPUT_VALIDATION.MIN_PASSWORD_LENGTH} characters
        </span>
      )}
    </div>
  );
});