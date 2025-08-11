'use client';

import { memo, useCallback, useState } from 'react';
import type { UseFormRegister, FieldError } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LoginFormData } from '@/app/schemas/loginSchema';
import type { FormField as FormFieldType } from '../utils/constants';
import { sanitizeInput } from '../../utils/validation';

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
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Enhanced input validation
  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const value = target.value;

    // Basic length validation
    if (value.length > 1000) {
      target.value = value.substring(0, 1000);
    }

    // Remove null bytes and control characters for security
    const sanitized = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    if (sanitized !== value) {
      target.value = sanitized;
    }
  }, []);

  const registerOptions = {
    ...register(field.id as keyof LoginFormData),
    onFocus: handleFocus,
    onBlur: handleBlur,
    onInput: handleInput,
  };

  return (
    <div className="flex flex-col text-zinc-300 gap-2">
      <Label 
        htmlFor={field.id} 
        className="text-sm lg:text-base font-medium"
      >
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      
      <Input
        id={field.id}
        type={field.type}
        placeholder={field.placeholder}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.id}-error` : undefined}
        autoComplete={field.id === 'email' ? 'email' : 'current-password'}
        spellCheck={false}
        {...registerOptions}
        className={`text-sm lg:text-base py-2 lg:py-2 h-10 lg:h-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          hasError ? 'border-red-500 focus:border-red-500' : ''
        } ${isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      />
      
      {hasError && (
        <span 
          id={`${field.id}-error`}
          className="text-red-400 text-xs lg:text-sm"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
});