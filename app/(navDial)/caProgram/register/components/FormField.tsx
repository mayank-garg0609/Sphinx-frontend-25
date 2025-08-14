import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inputClasses, fileInputClasses } from "../utils/constants";
import { CaRegisterFormData } from "../types/CARegistrations";

export interface FormFieldDefinition {
  key: keyof CaRegisterFormData;
  label: string;
  placeholder: string;
  type?: 'text' | 'file';
  accept?: string;
}

export interface FormFieldProps {
  field: FormFieldDefinition;
  register: any;
  error?: any;
}

export const FormField = memo<FormFieldProps>(({ field, register, error }) => {
  const isFileInput = field.type === 'file';
  const isRequired = field.key === 'resume';
  
  return (
    <div className="relative flex flex-col gap-1.5 sm:gap-2 text-zinc-300">
      <Label 
        htmlFor={field.key} 
        className={`text-sm sm:text-base font-medium `}
      >
        {field.label}
        {isRequired && <span className="text-red-400 ml-1">*</span>}
      </Label>

      <Input
        id={field.key}
        type={isFileInput ? 'file' : 'text'}
        placeholder={!isFileInput ? field.placeholder : undefined}
        accept={field.accept}
        {...register(field.key, {
          required: isRequired ? 'Resume is required' : false,
          validate: isFileInput ? (files: FileList) => {
            if (!files || files.length === 0) return 'Please select a PDF file';
            const file = files[0];
            if (file.type !== 'application/pdf') {
              return 'Only PDF files are allowed';
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
              return 'File size should be less than 5MB';
            }
            return true;
          } : undefined
        })}
        className={isFileInput ? fileInputClasses : inputClasses}
        autoComplete="off"
      />

      {isFileInput && (
        <div className="text-xs text-gray-400 mt-1">
          Only PDF files up to 5MB are allowed
        </div>
      )}

      <span
        className="text-red-400 text-xs sm:text-sm leading-tight min-h-[1.25rem]"
        aria-live="polite"
      >
        {error?.message?.toString() || "\u00A0"}
      </span>
    </div>
  );
});

FormField.displayName = "FormField";