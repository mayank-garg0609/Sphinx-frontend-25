import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inputClasses, fileInputClasses } from "../utils/constants";
import { CARegisterFormData } from "@/app/schemas/CARegisterSchema";

export interface FormFieldDefinition {
  key: keyof CARegisterFormData;
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
  
  // All fields are now required
  const getValidationRules = () => {
    if (isFileInput) {
      return {
        required: 'Resume is required',
        validate: (files: FileList) => {
          if (!files || files.length === 0) return 'Please select a PDF file';
          const file = files[0];
          if (file.type !== 'application/pdf') {
            return 'Only PDF files are allowed';
          }
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return 'File size should be less than 5MB';
          }
          return true;
        }
      };
    }
    
    // Text field validation based on field requirements
    const getTextFieldValidation = (key: string) => {
      switch (key) {
        case 'how_did_you_find_us':
          return {
            required: 'This field is required',
            minLength: { value: 10, message: 'Please provide at least 10 characters' },
            maxLength: { value: 500, message: 'Maximum 500 characters allowed' }
          };
        case 'why_should_we_choose_you':
          return {
            required: 'This field is required',
            minLength: { value: 20, message: 'Please provide at least 20 characters' },
            maxLength: { value: 1000, message: 'Maximum 1000 characters allowed' }
          };
        case 'past_experience':
          return {
            required: 'This field is required',
            minLength: { value: 10, message: 'Please provide at least 10 characters' },
            maxLength: { value: 1000, message: 'Maximum 1000 characters allowed' }
          };
        case 'your_strengths':
          return {
            required: 'This field is required',
            minLength: { value: 10, message: 'Please provide at least 10 characters' },
            maxLength: { value: 500, message: 'Maximum 500 characters allowed' }
          };
        case 'your_expectations':
          return {
            required: 'This field is required',
            minLength: { value: 10, message: 'Please provide at least 10 characters' },
            maxLength: { value: 500, message: 'Maximum 500 characters allowed' }
          };
        default:
          return { required: 'This field is required' };
      }
    };
    
    return getTextFieldValidation(field.key);
  };
  
  return (
    <div className="relative flex flex-col gap-1.5 sm:gap-2 text-zinc-300">
      <Label 
        htmlFor={field.key} 
        className={`text-sm sm:text-base font-medium `}
      >
        {field.label}
        <span className="text-red-400 ml-1">*</span>
      </Label>

      <Input
        id={field.key}
        type={isFileInput ? 'file' : 'text'}
        placeholder={!isFileInput ? field.placeholder : undefined}
        accept={field.accept}
        {...register(field.key, getValidationRules())}
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