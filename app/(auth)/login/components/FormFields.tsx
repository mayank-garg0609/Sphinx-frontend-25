'use client';

import { memo } from 'react';
import type { UseFormRegister, FieldError } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LoginFormData } from '@/app/schemas/loginSchema';
import type { FormField as FormFieldType } from '../utils/constants';

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
  const hasError = Boolean(error);

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
        {...register(field.id as keyof LoginFormData)}
        className={`text-sm lg:text-base py-2 lg:py-2 h-10 lg:h-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          hasError ? 'border-red-500 focus:border-red-500' : ''
        }`}
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