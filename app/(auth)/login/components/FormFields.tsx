import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FORM_FIELDS } from "../utils/constants";

interface FormFieldProps {
  field: typeof FORM_FIELDS.email | typeof FORM_FIELDS.password;
  register: any;
  error?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const FormField = memo(function FormField({
  field,
  register,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="flex flex-col text-zinc-300 gap-2">
      <Label htmlFor={field.id} className="text-sm lg:text-base font-medium">
        {field.label}
      </Label>
      <Input
        id={field.id}
        type={field.type}
        placeholder={field.placeholder}
        disabled={disabled}
        {...register(field.id)}
        className="text-sm lg:text-base py-2 lg:py-2 h-10 lg:h-auto disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
});
